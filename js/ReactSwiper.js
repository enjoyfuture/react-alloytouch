import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AlloyTouch from './AlloyTouch';
import Transform from 'alloytouch/transformjs/transform';

// 基于腾讯组件 https://github.com/AlloyTeam/AlloyTouch 实现
class ReactAlloyTouch extends Component {
  //可能需要传入的参数
  static propTypes = {
    className: PropTypes.string, // 自定义 className
    prefix: PropTypes.string, // 样式前缀
    options: PropTypes.object, // AlloyTouch 组件选项
    items: PropTypes.array, // 轮播图
    showDot: PropTypes.bool, //是否显示点
    active: PropTypes.number, // 当前活动轮播图
    autoPlay: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]), // 是否自动播放
    events: PropTypes.object, // 自定义各种事件
    onSlideChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    prefix: 'carousel',
    active: 0,
    autoPlay: 4000, // 默认一4秒播放一次
    tabsMenu: null,
    events: {},
  };

  constructor(props) {
    super(props);

    this.currentIndex = 0;
  }

  componentDidMount() {
    const {wrapper, scroller, nav, menu} = this.refs;
    const {options, items, prefix} = this.props;

    this.navItems = nav.querySelectorAll('a');
    Transform(scroller);

    const alloyOptions = {
      touch: wrapper, //反馈触摸的dom
      vertical: false, //不必需，默认是true代表监听竖直方向touch
      target: scroller, //运动的对象
      property: 'translateX',  //被运动的属性
      min: wrapper.clientWidth * -(items.length - 1), //不必需,运动属性的最小值
      max: 0, //不必需,滚动属性的最大值
      step: wrapper.clientWidth,
      spring: true, //不必需,是否有回弹效果。默认是true
      inertia: false, //不必需,是否有惯性。默认是true
      touchStart: this.touchStart,
      touchEnd: this.touchEnd,
      animationEnd: this.animationEnd,
      ...(options || {})
    };

    // 初始化 alloyTouch 实例
    this.alloyTouch = new AlloyTouch(alloyOptions);
    this.handleAutoPlay();
  }

  touchStart = () => {
    // 先删除
    clearInterval(this.timerId);
  };

  touchEnd = (evt, value, index) => {
    const {step, min, max} = this.alloyTouch;
    const stepV = index * step * -1;
    const dx = value - stepV;

    if (value < min) {
      this.alloyTouch.to(min);
    } else if (value > max) {
      this.alloyTouch.to(max);
    } else if (Math.abs(dx) < 30) {
      this.alloyTouch.to(stepV);
    } else if (dx > 0) {
      this.alloyTouch.to(stepV + step);
    } else {
      this.alloyTouch.to(stepV - step);
    }
    this.currentIndex = index;

    // 开启自动播放
    this.handleAutoPlay();
    return false;
  };

  animationEnd = () => {
    const len = this.navItems.length;
    let i = 0;
    for (; i < len; i++) {
      if (i === this.alloyTouch.currentPage) {
        this.navItems[i].classList.add('active');
      } else {
        this.navItems[i].classList.remove('active');
      }
    }

    if (typeof this.props.onSlideChange === 'function') this.props.onSlideChange(this.alloyTouch.currentPage)
  };

  //给外部组件提供接口
  SlideTo = (index) => {
      const {step} = this.alloyTouch;
      const stepV = index * step * -1;
      this.alloyTouch.to(stepV);
  };

  // 自动播放
  handleAutoPlay() {
    const {autoPlay, items} = this.props;
    const len = items.length;
    if (autoPlay) {
      this.timerId = setInterval(() => {
        const {step} = this.alloyTouch;
        const stepV = this.currentIndex * step * -1;
        this.alloyTouch.to(stepV);
        if (this.currentIndex >= len - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }, autoPlay);
    }
  }

  render() {
    const {
      className, prefix, items, active, showDot, events,
    } = this.props;

    const len = items.length;
    return (
      <div className={`${prefix}-wrapper ${className || ''}`} ref="wrapper">
        <div className={`${prefix}-scroller`} ref="scroller" style={{width: `${100 * len}%`}}>
          {items.map((item, index) => {
            /*eslint-disable react/no-array-index-key*/
            return (<div key={index} className="swiper-panel" style={{width: `${100 / len}%`}} {...events}>
              {item}
            </div>);
          })}
        </div>
        <div className={`${prefix}-nav`} ref="nav" style={{display: showDot ? 'inline-block' : 'none'}}>
          {items.map((it, index) => {
            /*eslint-disable react/no-array-index-key*/
            return (<a key={index} className={active === index ? 'active' : ''}></a>);
          })}
        </div>
      </div>
    );
  }
}

export default ReactAlloyTouch;
