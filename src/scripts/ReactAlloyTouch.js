import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AlloyTouch from './AlloyTouch';
import Transform from 'alloytouch/transformjs/transform';
import '../sass/index.scss';

class ReactAlloyTouch extends Component {
  //可能需要传入的参数
  static propTypes = {
    children: PropTypes.node, // 待渲染的内容
    className: PropTypes.string, // 自定义 className
    header: PropTypes.element, // 头部
    footer: PropTypes.element, // 底部
    refresh: PropTypes.bool, // 是否下拉刷新
    loadMore: PropTypes.bool, // 是否加载更多
    refreshThreshold: PropTypes.number, // 设置刷新页面时，距离顶部临界值，
    //loadMoreThrottle: PropTypes.number, // 设置加载更多，距离最底部临界值，
    refreshCallback: PropTypes.func, // 刷新回调函数
    lockInTime: PropTypes.number, // 延迟刷新或加载
    pullDownText: PropTypes.array, // 下拉显示文本内容
    //pullUpText: PropTypes.array, // 上拉显示文本内容
    enableText: PropTypes.bool, // 是否显示文本
  };

  static defaultProps = {
    className: '',
    refreshThreshold: 50,
    loadMoreThrottle: 50,
    lockInTime: 0,
    pullDownText: ['下拉刷新', '松开刷新数据', '加载中，请稍后...'],
    pullUpText: ['上滑加载更多...', '松开加载数据', '加载中，请稍后...', '没有更多数据了'],
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshText: props.pullDownText[0]
    };
    // 开启状态: 分为没有开启，开启，加载中 null enable loading
    this.refreshState = null;
  }

  componentDidMount() {
    // 初始化 alloyTouch 实例
    const {header, footer, wrapper, scroller} = this.refs;
    Transform(scroller, true);

    // 设置向下滑动时，滑动的最小值，如果采用translateY，则设置 y的最小值，如果不设置 min，则可以无限制的向下滑动
    const min = wrapper.clientHeight - (header ? header.clientHeight : 0)
      - (footer ? footer.clientHeight : 0) - scroller.scrollHeight;

    this.alloyTouch = new AlloyTouch({
      touch: wrapper, // 反馈触摸的dom
      target: scroller, // 运动的对象
      vertical: true, // 不必需，默认是true代表监听竖直方向touch
      property: 'translateY',  // 被运动的属性
      sensitivity: 1, // 不必需,触摸区域的灵敏度，默认值为1，可以为负数
      factor: 1, // 不必需,表示触摸位移与被运动属性映射关系，默认值是1
      min,
      max: 0, // 不必需,滚动属性的最大值
      step: 40, // 用于校正到step的整数倍
      touchMove: this.touchMove,
      touchEnd: this.touchEnd,
      animationEnd: (value) => { }, //运动结束
      pressMove: (evt, value) => { },
    });
  }

  componentDidUpdate() {
    // 每次页面数据更改后，需要重新设置 this.alloyTouch 的 min 值
    const {header, footer, wrapper, scroller} = this.refs;

    const min = wrapper.clientHeight - (header ? header.clientHeight : 0)
      - (footer ? footer.clientHeight : 0) - scroller.scrollHeight;
    this.alloyTouch.setOption('min', min);
  }

  // touch 移动时，分刷新和加载更多
  touchMove = (e, value) => {
    const {refreshThreshold, refresh, pullDownText} = this.props;
    if (refresh && this.refreshState !== 'loading') {
      const {refreshEl, iconEl} = this.refs;
      const {style} = refreshEl;
      if (value > 0) {
        style.webkitTransform = `translate3d(0, ${value}px, 0)`;
        style.transform = `translate3d(0, ${value}px, 0)`;
        if (value > refreshThreshold) {
          this.refreshState = 'enable';
          iconEl.classList.add('rotate');
          this.setState({
            refreshText: pullDownText[1]
          });
        } else {
          this.refreshState = null;
          iconEl.classList.remove('rotate');
          this.setState({
            refreshText: pullDownText[0]
          });
        }
      }
    }
  };

  // touch end
  touchEnd = (e, value) => {
    const {refresh} = this.props;
    if (refresh && value > 0) {
      if (this.refreshState === 'enable') {
        this.refresh(e);
      } else {
        this.resetRefreshState();
      }
      // 阻止默认的滑动
      return false;
    }
  };

  // 刷新数据
  refresh = (e) => {
    if (e) {
      e.stopImmediatePropagation();
    }

    if (this.refreshState === null || this.refreshState === 'loading') {
      return;
    }
    this.refreshState = 'loading';
    const {refreshCallback, lockInTime, pullDownText} = this.props;
    const {refreshEl, iconEl} = this.refs;
    const {style} = refreshEl;
    iconEl.classList.add('loading');
    this.setState({
      refreshText: pullDownText[2]
    });

    if (refreshCallback && typeof refreshCallback === 'function') {
      if (lockInTime > 0) {
        clearTimeout(this.refreshTimoutId);
        this.refreshTimoutId = setTimeout(() => {
          refreshCallback().then(this.resetRefreshState, this.resetRefreshState);
        }, lockInTime);
      } else {
        refreshCallback().then(this.resetRefreshState, this.resetRefreshState);
      }
    } else {
      this.resetRefreshState();
    }
  };

  // 恢复刷新状态
  resetRefreshState = () => {
    const {pullDownText} = this.props;
    this.refreshState = null;
    const {refreshEl, iconEl} = this.refs;
    const {style} = refreshEl;
    iconEl.classList.remove('rotate');
    iconEl.classList.remove('loading');

    style.transition = '';
    style.webkitTransition = '';
    style.webkitTransform = 'translate3d(0, 0, 0)';
    style.transform = 'translate3d(0, 0, 0)';

    this.setState({
      refreshText: pullDownText[0]
    });
    // 恢复
    this.alloyTouch.to(0);
  };

  render() {
    const {children, className, header, footer, refresh, loadMore, enableText} = this.props;
    const {refreshText} = this.state;

    return (
      <div className={`alloy-panel ${className}`}>
        {header ? (<div className="alloy-header" ref="header">{header}</div>) : null}
        {
          refresh ? (<div ref="refreshEl" className="alloy-refresh">
            <div className="alloy-refresh-icon-wrapper">
              <div ref="iconEl" className="alloy-refresh-icon"></div>
            </div>
            {enableText ? (<div className="alloy-refresh-text">{refreshText}</div>) : null}
          </div>) : null
        }
        <div className="alloy-wrapper" ref="wrapper">
          <div className="alloy-scroller" ref="scroller">
            {children}
          </div>
        </div>
        {
          loadMore ? (
            <div className="alloy-load-more" ref="moreEl"></div>
          ) : null
        }
        {footer ? (<div className="alloy-footer" ref="footer">{footer}</div>) : null}
      </div>
    );
  }
}

export default ReactAlloyTouch;
