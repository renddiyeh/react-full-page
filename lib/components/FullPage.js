'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _animatedScrollTo = require('../utils/animated-scroll-to');

var _animatedScrollTo2 = _interopRequireDefault(_animatedScrollTo);

var _isMobile = require('../utils/is-mobile');

var _isMobile2 = _interopRequireDefault(_isMobile);

var _Slide = require('./Slide');

var _Slide2 = _interopRequireDefault(_Slide);

var _Controls = require('./Controls');

var _Controls2 = _interopRequireDefault(_Controls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullPage = function (_React$Component) {
  _inherits(FullPage, _React$Component);

  function FullPage(props) {
    _classCallCheck(this, FullPage);

    var _this = _possibleConstructorReturn(this, (FullPage.__proto__ || Object.getPrototypeOf(FullPage)).call(this, props));

    _this.onResize = function () {
      _this._slides = [];

      for (var i = 0; i < _this._slidesCount; i++) {
        _this._slides.push(window.innerHeight * i);
      }
      _this.checkChildrenOverflow();

      _this.setState({
        height: window.innerHeight
      });
    };

    _this.onTouchStart = function (evt) {
      _this._touchStart = evt.touches[0].clientY;
      _this._isScrolledAlready = false;
    };

    _this.onTouchMove = function (evt) {
      var touchEnd = evt.changedTouches[0].clientY;
      if (!_this._isScrollPending && !_this._isScrolledAlready) {
        if (_this._touchStart > touchEnd + _this._touchSensitivity) {
          if (_this.checkOverflowScrolling(true, evt.target)) {
            evt.preventDefault();
            _this.scrollToSlide(_this.state.activeSlide + 1);
          }
        } else if (_this._touchStart < touchEnd - _this._touchSensitivity) {
          if (_this.checkOverflowScrolling(false, evt.target)) {
            evt.preventDefault();
            _this.scrollToSlide(_this.state.activeSlide - 1);
          }
        }
      }
    };

    _this.onScroll = function (evt) {
      var scrollDown = (evt.wheelDelta || -evt.deltaY || -evt.detail) < 0;
      if (_this.checkOverflowScrolling(scrollDown, evt.target)) {
        evt.preventDefault();

        if (_this._isScrollPending) {
          return;
        }

        var activeSlide = _this.state.activeSlide;


        if (scrollDown) {
          activeSlide++;
        } else {
          activeSlide--;
        }

        _this.scrollToSlide(activeSlide);
      }
    };

    _this.getSlidesCount = function () {
      return _this._slidesCount;
    };

    _this.getCurrentSlideIndex = function () {
      return _this.state.activeSlide;
    };

    _this.checkChildrenOverflow = function () {
      _this.chidrenOverflow = [];
      _this.chidrenRef = [];
      _this._container.childNodes.forEach(function (slide, index) {
        if (index > 0) {
          _this.chidrenRef.push(slide);
          _this.chidrenOverflow.push(slide.clientHeight - window.innerHeight);
          /* eslint-disable no-param-reassign */
          if (slide.clientHeight > window.innerHeight) {
            slide.style.touchAction = 'pan-y';
            slide.style.overflowY = 'scroll';
          }
          /* eslint-enable no-param-reassign */
        }
      });
    };

    _this.checkOverflowScrolling = function (scrollDown, target) {
      var overflow = _this.chidrenOverflow[_this.state.activeSlide];
      var slide = _this.chidrenRef[_this.state.activeSlide];
      if (overflow > 0 && target === slide) {
        return scrollDown ? slide.scrollTop >= overflow / 2 : slide.scrollTop <= 0;
      }
      return true;
    };

    _this.handleRef = function (ref) {
      _this._container = ref;
    };

    _this.scrollNext = function () {
      _this.scrollToSlide(_this.state.activeSlide + 1);
    };

    _this.scrollPrev = function () {
      _this.scrollToSlide(_this.state.activeSlide - 1);
    };

    _this.scrollToSlide = function (slide) {
      if (!_this._isScrollPending && slide >= 0 && slide < _this._slidesCount) {
        var currentSlide = _this.state.activeSlide;
        _this.props.beforeChange({ from: currentSlide, to: slide });

        _this.setState({
          activeSlide: slide
        });

        _this._isScrollPending = true;
        (0, _animatedScrollTo2.default)(_this._slides[slide], _this.props.duration, function () {
          _this._isScrollPending = false;
          _this._isScrolledAlready = true;

          _this.props.afterChange({ from: currentSlide, to: slide });
        });
      }
    };

    _this._isScrollPending = false;
    _this._isScrolledAlready = false;
    _this._slides = [];
    _this._slidesCount = FullPage.getChildrenCount(_this.props.children);
    _this._touchSensitivity = 5;
    _this._touchStart = 0;
    _this._isMobile = null;

    _this.state = {
      activeSlide: props.initialSlide
    };
    return _this;
  }

  _createClass(FullPage, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMobile = (0, _isMobile2.default)();
      if (this._isMobile) {
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchstart', this.onTouchStart);
      } else {
        document.addEventListener('wheel', this.onScroll);
      }
      window.addEventListener('resize', this.onResize);

      this.onResize();
      this.scrollToSlide(this.props.initialSlide);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._isMobile) {
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchstart', this.onTouchStart);
      } else {
        document.removeEventListener('wheel', this.onScroll);
      }
      window.removeEventListener('resize', this.onResize);
    }
  }, {
    key: 'renderControls',
    value: function renderControls() {
      var _props = this.props,
          controls = _props.controls,
          controlsProps = _props.controlsProps;

      if (!controls) {
        return null;
      }

      var controlsBasicProps = {
        getCurrentSlideIndex: this.getCurrentSlideIndex,
        onNext: this.scrollNext,
        onPrev: this.scrollPrev,
        scrollToSlide: this.scrollToSlide,
        slidesCount: this.getSlidesCount()
      };

      if (controls === true) {
        return _react2.default.createElement(_Controls2.default, _extends({
          className: 'full-page-controls'
        }, controlsBasicProps, controlsProps));
      }

      var CustomControls = controls;
      return _react2.default.createElement(CustomControls, _extends({}, controlsBasicProps, controlsProps));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: { height: this.state.height }, ref: this.handleRef },
        this.renderControls(),
        this.props.children
      );
    }
  }]);

  return FullPage;
}(_react2.default.Component);

FullPage.propTypes = {
  children: _propTypes2.default.node.isRequired,
  controls: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.element, _propTypes2.default.func]),
  controlsProps: _propTypes2.default.object,
  duration: _propTypes2.default.number,
  initialSlide: _propTypes2.default.number,
  beforeChange: _propTypes2.default.func,
  afterChange: _propTypes2.default.func
};
FullPage.defaultProps = {
  controls: false,
  controlsProps: {},
  duration: 700,
  initialSlide: 0,
  beforeChange: function beforeChange() {},
  afterChange: function afterChange() {}
};

FullPage.getChildrenCount = function (children) {
  var childrenArr = _react2.default.Children.toArray(children);
  var slides = childrenArr.filter(function (_ref) {
    var type = _ref.type;
    return type === _Slide2.default;
  });
  return slides.length;
};

exports.default = FullPage;