(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
  (global = global || self, factory(global.giftmessage = {}, global.React, global.PropTypes));
}(this, function (exports, React, PropTypes) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var KEYCODES = {
    TOP: 38,
    BOTTOM: 40,
    LEFT: 37,
    RIGHT: 39,
    BACKSPACE: 8,
    ENTER: 13
  };
  var emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

  var GiftMessage =
  /*#__PURE__*/
  function () {
    function GiftMessage(parent, maxLength, onUpdate) {
      var _this = this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      _classCallCheck(this, GiftMessage);

      this.elements = parent.getElementsByTagName('input');
      this.lines = this.elements.length;
      this.maxLength = maxLength;
      this.regex = new RegExp("(.{0,".concat(this.maxLength, "})(?:\\s|$)"), 'g');
      this.options = options;
      this.onFocus = this.onFocus.bind(this);
      this.onInput = this.onInput.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      if (onUpdate) this.onUpdate = onUpdate;
      Array.from(this.elements).forEach(function (el) {
        el.addEventListener('focus', _this.onFocus);
        el.addEventListener('input', _this.onInput);
        el.addEventListener('keydown', _this.onKeyDown);
      });
    }

    _createClass(GiftMessage, [{
      key: "setActiveIndex",
      value: function setActiveIndex(line) {
        this.activeIndex = Math.max(0, Math.min(line, this.lines - 1));
      }
    }, {
      key: "getLineValues",
      value: function getLineValues() {
        var values = [];

        for (var i = 0; i < this.lines; i++) {
          values.push(this.elements[i].value);
        }

        return values;
      }
    }, {
      key: "adjustLines",
      value: function adjustLines(values) {
        var _this2 = this;

        values = values.concat();
        return values.map(function (v, i) {
          v = v.match(_this2.regex);
          if (i !== values.length - 1) values[i + 1] = (v[1] || '') + values[i + 1];
          return v[0];
        });
      }
    }, {
      key: "setLines",
      value: function setLines(values) {
        for (var i = 0; i < this.lines; i++) {
          this.elements[i].value = values[i];
        }
      }
    }, {
      key: "setCaretPosition",
      value: function setCaretPosition(line, position, focus) {
        var element = this.elements[line];

        if (element) {
          if (focus) element.focus();
          element.selectionStart = position;
          element.selectionEnd = position;
        }
      }
    }, {
      key: "onFocus",
      value: function onFocus(e) {
        this.setActiveIndex(Array.from(this.elements).indexOf(e.target));
      }
    }, {
      key: "onInput",
      value: function onInput(e) {
        var caretPosition = this.elements[this.activeIndex].selectionStart;
        if (this.options.noEmojis) caretPosition = GiftMessage.removeEmojis(e, caretPosition);

        if (this.activeIndex < this.lines - 1) {
          var values = this.getLineValues();
          var adjusted = this.adjustLines(values);
          this.setLines(adjusted);

          if (caretPosition > adjusted[this.activeIndex].length) {
            this.setActiveIndex(this.activeIndex + 1);
            this.setCaretPosition(this.activeIndex, adjusted[this.activeIndex].length - values[this.activeIndex].length, true);
          } else {
            this.setCaretPosition(this.activeIndex, caretPosition);
          }
        } else if (e.target.value.length > this.maxLength) {
          e.target.value = e.target.value.substr(0, this.maxLength);
          this.setCaretPosition(this.activeIndex, caretPosition);
        }

        if (typeof this.onUpdate === 'function') this.onUpdate(this.getLineValues());
      }
    }, {
      key: "onKeyDown",
      value: function onKeyDown(e) {
        switch (e.which) {
          case KEYCODES.TOP:
            e.preventDefault();
            this.setCaretPosition(this.activeIndex - 1, this.maxLength, true);
            break;

          case KEYCODES.BACKSPACE:
          case KEYCODES.LEFT:
            {
              if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
                e.preventDefault();
                this.setCaretPosition(this.activeIndex - 1, this.maxLength, true);
              }

              break;
            }

          case KEYCODES.RIGHT:
            if (this.activeIndex <= this.lines - 1 && e.target.selectionStart === e.target.value.length) {
              e.preventDefault();
              this.setCaretPosition(this.activeIndex + 1, 0, true);
            }

            break;

          case KEYCODES.ENTER:
            if (this.activeIndex === this.lines - 1) {
              return;
            }

          case KEYCODES.BOTTOM:
            {
              e.preventDefault();
              this.setCaretPosition(this.activeIndex + 1, 0, true);
              break;
            }
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var _this3 = this;

        Array.from(this.elements).forEach(function (el) {
          el.removeEventListener('input', _this3.onInput);
          el.removeEventListener('keydown', _this3.onKeyDown);
        });
      }
    }], [{
      key: "removeEmojis",
      value: function removeEmojis(e, caretPosition) {
        var previousLength = e.target.value.length;
        e.target.value = e.target.value.replace(emojiRegex, '');
        return caretPosition + e.target.value.length - previousLength;
      }
    }]);

    return GiftMessage;
  }();

  var GiftMessage$1 =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(GiftMessage$1, _React$Component);

    function GiftMessage$1(props) {
      var _this;

      _classCallCheck(this, GiftMessage$1);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GiftMessage$1).call(this, props));
      _this.state = {
        charactersTyped: Array.isArray(props.defaultValues) ? props.defaultValues.reduce(function (acc, curr) {
          return curr ? acc + curr.length : acc;
        }, 0) : 0,
        maxCharacters: props.lines * props.maxLength
      };
      _this.onUpdate = _this.onUpdate.bind(_assertThisInitialized(_this));
      _this.updateCharactersTyped = _this.updateCharactersTyped.bind(_assertThisInitialized(_this));
      _this.wrapperRef = React.createRef();
      return _this;
    }

    _createClass(GiftMessage$1, [{
      key: "updateCharactersTyped",
      value: function updateCharactersTyped(values) {
        this.setState({
          charactersTyped: values.reduce(function (acc, curr) {
            return curr ? acc + curr.length : acc;
          }, 0)
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.giftMessageInstance = new GiftMessage(this.wrapperRef.current, this.props.maxLength, this.onUpdate, {
          noEmojis: this.props.noEmojis
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.giftMessageInstance.destroy();
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement("div", {
          id: this.props.id,
          className: this.props.className,
          ref: this.wrapperRef
        }, React.createElement("div", {
          className: "".concat(this.props.className, "-lines")
        }, this.renderFields()), React.createElement("div", {
          className: "".concat(this.props.className, "-total")
        }, Math.max(0, this.state.maxCharacters - this.state.charactersTyped), " ", this.props.remainingWording));
      }
    }, {
      key: "renderFields",
      value: function renderFields() {
        var fields = [];
        var _this$props = this.props,
            defaultValues = _this$props.defaultValues,
            lines = _this$props.lines,
            ariaLineLabel = _this$props.ariaLineLabel,
            placeholders = _this$props.placeholders;

        for (var i = 0; i < lines; i++) {
          fields.push(React.createElement("input", {
            key: i,
            "aria-label": ariaLineLabel ? "".concat(ariaLineLabel, " ").concat(i + 1) : '',
            placeholder: placeholders ? placeholders[i] : '',
            defaultValue: defaultValues ? defaultValues[i] : ''
          }));
        }

        return fields;
      }
    }, {
      key: "onUpdate",
      value: function onUpdate(values) {
        this.updateCharactersTyped(values);
        if (typeof this.props.onUpdate === 'function') this.props.onUpdate(values);
      }
    }]);

    return GiftMessage$1;
  }(React.Component);

  GiftMessage$1.propTypes = {
    maxLength: PropTypes.number.isRequired,
    ariaLineLabel: PropTypes.string,
    lines: PropTypes.number.isRequired,
    className: PropTypes.string.isRequired,
    id: PropTypes.string,
    remainingWording: PropTypes.string,
    onUpdate: PropTypes.func,
    defaultValues: PropTypes.arrayOf(PropTypes.string),
    placeholders: PropTypes.arrayOf(PropTypes.string),
    noEmojis: PropTypes.bool
  };

  exports.ReactGiftMessage = GiftMessage$1;
  exports.default = GiftMessage;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
