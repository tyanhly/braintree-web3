'use strict';

var BaseInput = require('../../../../../src/hosted-fields/internal/components/base-input').BaseInput;
var constants = require('../../../../../src/hosted-fields/shared/constants');
var RestrictedInput = require('restricted-input');
var FakeRestrictedInput = require('../../../../../src/lib/fake-restricted-input');

describe('Base Input', function () {
  Object.keys(constants.whitelistedFields).forEach(function (key) {
    describe(key, function () {
      beforeEach(function () {
        var config = {};

        this.config = config;
        this.sandbox.stub(BaseInput.prototype, 'getConfiguration', function () {
          return config;
        });

        this.sandbox.stub(BaseInput.prototype, 'addDOMEventListeners');
        this.sandbox.stub(BaseInput.prototype, 'addModelEventListeners');
        this.sandbox.stub(BaseInput.prototype, 'render');
      });

      beforeEach(function () {
        this.model = {};
        this.type = key;
      });

      beforeEach(function () {
        this.instance = new BaseInput({
          model: this.model,
          type: this.type
        });
      });

      describe('formatter', function () {
        it('creates a RestrictedInput formatter by default', function () {
          expect(this.instance.formatter).to.be.an.instanceof(RestrictedInput);
        });

        it('creates a FakeRestrictedInput formatter if formatting is disabled', function () {
          var instance;

          BaseInput.prototype.getConfiguration.restore();
          this.sandbox.stub(BaseInput.prototype, 'getConfiguration', function () {
            return {formatInput: false};
          });

          instance = new BaseInput({
            model: this.model,
            type: this.type
          });

          expect(instance.formatter).to.be.an.instanceof(FakeRestrictedInput);
        });
      });

      describe('element', function () {
        it('is an input', function () {
          expect(this.instance.element).to.be.an.instanceof(HTMLInputElement);
        });

        describe('attributes', function () {
          afterEach(function () {
            delete BaseInput.prototype.maxLength;
          });

          describe('placeholder', function () {
            it('applies if provided', function () {
              var instance;

              this.config.placeholder = key.toUpperCase();
              instance = new BaseInput({model: this.model});

              expect(instance.element.getAttribute('placeholder')).to.equal(key.toUpperCase());
            });

            it('does not apply if not defined', function () {
              expect(this.instance.element.getAttribute('placeholder')).to.equal(null);
            });
          });

          describe('type', function () {
            it('applies if provided', function () {
              var instance;

              this.config.type = 'password';
              instance = new BaseInput({model: this.model, type: 'cvv'});

              expect(instance.element.getAttribute('type')).to.equal('password');
            });

            it('uses "tel" if not provided', function () {
              expect(this.instance.element.getAttribute('type')).to.equal('tel');
            });
          });

          describe('maxlength', function () {
            it('applies if set as property on instance', function () {
              var instance;

              BaseInput.prototype.maxLength = 33;
              instance = new BaseInput({model: this.model});

              expect(instance.element.getAttribute('maxlength')).to.equal('33');
            });

            it('does not apply if not defined', function () {
              expect(this.instance.element.getAttribute('maxlength')).to.equal(null);
            });
          });

          describe('defaults', function () {
            it('applies type', function () {
              expect(this.instance.element.getAttribute('type')).to.equal('tel');
            });

            it('applies autocomplete', function () {
              expect(this.instance.element.getAttribute('autocomplete')).to.equal('off');
            });

            it('applies autocorrect', function () {
              expect(this.instance.element.getAttribute('autocorrect')).to.equal('off');
            });

            it('applies autocapitalize', function () {
              expect(this.instance.element.getAttribute('autocapitalize')).to.equal('none');
            });

            it('applies spellcheck', function () {
              expect(this.instance.element.getAttribute('spellcheck')).to.equal('false');
            });

            it('applies name', function () {
              expect(this.instance.element.getAttribute('name')).to.equal(constants.whitelistedFields[key].name);
            });

            it('applies id', function () {
              expect(this.instance.element.getAttribute('id')).to.equal(constants.whitelistedFields[key].name);
            });
          });

          describe('class', function () {
            it('applies as type', function () {
              expect(this.instance.element.getAttribute('class')).to.equal(key);
            });
          });

          describe('data-braintree-name', function () {
            it('applies based on type', function () {
              expect(this.instance.element.getAttribute('data-braintree-name')).to.equal(key);
            });
          });
        });
      });
    });
  });
});
