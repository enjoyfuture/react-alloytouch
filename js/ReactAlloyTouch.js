import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AlloyTouch from './AlloyTouch';
import Transform from 'alloytouch/transformjs/transform';

// 基于腾讯组件 https://github.com/AlloyTeam/AlloyTouch 实现
class ReactAlloyTouch extends Component {
  //可能需要传入的参数
  static propTypes = {
    children: PropTypes.node, // 待渲染的内容
    className: PropTypes.string, // 自定义 className
    prefix: PropTypes.string, // 样式前缀
    options: PropTypes.object, // AlloyTouch 组件选项
    transform: PropTypes.bool, // 是否用 Transform 处理
    extensionFunc: PropTypes.func, // 扩展函数，处理额外的功能
    updateFunc: PropTypes.func, // 执行 componentDidUpdate 调用的回调
  };

  static defaultProps = {
    className: '',
    prefix: 'alloy',
    options: {},
    transform: true,
  };

  componentDidMount() {
    const {wrapper, scroller} = this.refs;
    const {options, transform, extensionFunc} = this.props;

    // 处理 options 中函数，返回 wrapper 和 scroller
    Object.keys(options).forEach((func) => {
      if (typeof func === 'function') {
        options[func] = function (...args) {
          options[func](...args, wrapper, scroller);
        };
      }
    });

    if (transform) {
      Transform(scroller, true);
    }

    let min = wrapper.clientHeight - scroller.scrollHeight;
    if (min >= 0) {
      min = 0;
    }

    const alloyOptions = {
      touch: wrapper, // 反馈触摸的dom
      target: scroller, // 运动的对象
      vertical: true, // 不必需，默认是true代表监听竖直方向touch
      property: 'translateY',  // 被运动的属性
      sensitivity: 1, // 不必需,触摸区域的灵敏度，默认值为1，可以为负数
      factor: 1, // 不必需,表示触摸位移与被运动属性映射关系，默认值是1
      min,
      max: 0, // 不必需,滚动属性的最大值
      step: 40, // 用于校正到step的整数倍
      ...(options || {})
    };

    // 初始化 alloyTouch 实例
    this.alloyTouch = new AlloyTouch(alloyOptions);

    if (typeof extensionFunc === 'function') {
      extensionFunc(this.alloyTouch, wrapper, scroller);
    }
  }

  componentDidUpdate() {
    const {updateFunc} = this.props;
    const {wrapper, scroller} = this.refs;
    if (typeof updateFunc === 'function') {
      updateFunc(this.alloyTouch, wrapper, scroller);
    }
  }

    handleWrapper=(wrapper) => {
        this.wrapper = wrapper
    }
    handleScroller=(scroller) => {
        this.scroller = scroller
    }

    render() {
        const {
            children, className, prefix
        } = this.props;

        return (
            <div className={`${prefix}-wrapper ${className || ''}`} ref={this.handleWrapper}>
              <div className={`${prefix}-scroller`} ref={this.handleScroller}>
                  {children}
              </div>
            </div>
        );
    }
}

export default ReactAlloyTouch;
