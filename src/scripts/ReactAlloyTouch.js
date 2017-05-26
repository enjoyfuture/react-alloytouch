import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AlloyTouch from './AlloyTouch';
import Transform from 'alloytouch/transformjs/transform';
import '../sass/index.scss';

// 基于腾讯组件
class ReactAlloyTouch extends Component {
  //可能需要传入的参数
  static propTypes = {
    children: PropTypes.node, // 待渲染的内容
    className: PropTypes.string, // 自定义 className
    header: PropTypes.element, // 头部
    footer: PropTypes.element, // 底部
    options: PropTypes.object, // AlloyTouch 组件选项
    lockInTime: PropTypes.number, // 延迟刷新或加载
    enableText: PropTypes.bool, // 是否显示文本
    refresh: PropTypes.bool, // 是否下拉刷新
    refreshThreshold: PropTypes.number, // 设置刷新页面时，距离顶部临界值，
    refreshCallback: PropTypes.func, // 刷新回调函数
    pullDownText: PropTypes.array, // 下拉显示文本内容
    loadMore: PropTypes.bool, // 是否加载更多
    loadMoreThrottle: PropTypes.number, // 设置加载更多，距离最底部临界值，
    loadMoreCallback: PropTypes.func, // 加载更多回调函数
    pullUpText: PropTypes.array, // 上拉显示文本内容
    loadMoreProcessIcon: PropTypes.bool, // 加载更多过程图标
    disablePullUp: PropTypes.bool, // 对于上拉加载更多时，如果没有更多记录时，禁止上滑
  };

  static defaultProps = {
    className: '',
    refreshThreshold: 50,
    loadMoreThrottle: 10,
    lockInTime: 0,
    pullDownText: ['下拉刷新', '松开刷新数据', '加载中，请稍后...'],
    pullUpText: ['上滑加载更多...', '松开加载数据', '加载中，请稍后...', '没有更多数据了'],
    enableText: true,
    loadMoreProcessIcon: false
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshText: props.pullDownText[0],
      loadMoreText: props.pullUpText[0]
    };
    // 下拉状态: 分为没有开启，开启，加载中 null enable loading
    this.refreshState = null;
    // 上滑状态: 分为没有开启，开启，加载中 null enable loading
    this.loadMoreState = null;
  }

  componentDidMount() {
    const {header, footer, wrapper, scroller} = this.refs;
    const {options} = this.props;
    Transform(scroller, true);

    // 设置向下滑动时，滑动的最小值，如果采用translateY，则设置 y的最小值，如果不设置 min，则可以无限制的向下滑动
    const min = wrapper.clientHeight - (header ? header.clientHeight : 0)
      - (footer ? footer.clientHeight : 0) - scroller.scrollHeight;

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
      touchStart: this.touchStart,
      touchMove: this.touchMove,
      touchEnd: this.touchEnd,
      ...(options || {})
    };

    // 初始化 alloyTouch 实例
    this.alloyTouch = new AlloyTouch(alloyOptions);
  }

  componentDidUpdate() {
    // 每次页面数据更改后，需要重新设置 this.alloyTouch 的 min 值
    const {header, footer, wrapper, scroller} = this.refs;

    const min = wrapper.clientHeight - (header ? header.clientHeight : 0)
      - (footer ? footer.clientHeight : 0) - scroller.scrollHeight;
    this.alloyTouch.setOption('min', min);
  }

  // touch 开始时
  touchStart = (e, value) => {
    if (this.props.loadMore) {
      // 记录当前滑动值
      this.offsetStart = value;
    }
  };

  // touch 移动时，分刷新和加载更多
  touchMove = (e, value) => {
    const {
      refresh, loadMore, refreshThreshold, loadMoreThrottle,
      pullDownText, pullUpText
    } = this.props;

    // 下拉刷新
    if (refresh && this.refreshState !== 'loading') {
      const {refreshEl, refreshIconEl} = this.refs;
      const {style} = refreshEl;
      if (value > 0) {
        style.webkitTransform = `translate3d(0, ${value}px, 0)`;
        style.transform = `translate3d(0, ${value}px, 0)`;
        if (value > refreshThreshold) {
          this.refreshState = 'enable';
          refreshIconEl.classList.add('rotate');
          this.setState({
            refreshText: pullDownText[1]
          });
        } else {
          this.refreshState = null;
          refreshIconEl.classList.remove('rotate');
          this.setState({
            refreshText: pullDownText[0]
          });
        }
      }
    }

    // 上滑加载更多
    if (loadMore) {
      const {disablePullUp} = this.props;
      const {loadMoreEl, loadMoreIconEl} = this.refs;
      const {style} = loadMoreEl;
      const {header, footer, wrapper, scroller} = this.refs;

      const min = wrapper.clientHeight - (header ? header.clientHeight : 0)
        - (footer ? footer.clientHeight : 0) - scroller.scrollHeight;

      if (this.loadMoreState !== 'loading') {
        if (disablePullUp) {
          loadMoreEl.style.visibility = value < min - 5 ? 'visible' : 'hidden';
          return false;
        }
        if (value < min) {
          style.visibility = 'visible';
          if (value < min - loadMoreThrottle) {
            this.loadMoreState = 'enable';
            loadMoreIconEl.classList.add('rotate');
            this.setState({
              loadMoreText: pullUpText[1]
            });
          } else {
            this.loadMoreState = null;
            loadMoreIconEl.classList.remove('rotate');
            this.setState({
              loadMoreText: pullUpText[0]
            });
          }
        } else {
          style.visibility = 'hidden';
        }
      }
    }
  };

  // touch end
  touchEnd = (e, value) => {
    const {refresh, loadMore, disablePullUp} = this.props;
    // 刷新
    if (refresh && value > 0) {
      if (this.refreshState === 'enable') {
        this.refresh(e);
      } else {
        this.resetRefreshState();
      }
      // 阻止默认的滑动
      return false;
    }

    // 加载更多
    if (loadMore && !disablePullUp) {
      const {header, footer, wrapper, scroller} = this.refs;
      const min = wrapper.clientHeight - (header ? header.clientHeight : 0)
        - (footer ? footer.clientHeight : 0) - scroller.scrollHeight;
      if (value < min) {
        if (this.loadMoreState === 'enable') {
          this.loadMore(e);
          this.offsetEnd = value;
          // 阻止默认的滑动
          return false;
        }
        this.resetLoadMoreState();
      }
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
    const {refreshIconEl} = this.refs;
    refreshIconEl.classList.add('loading');
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

  // 恢复刷新原始状态
  resetRefreshState = () => {
    const {pullDownText} = this.props;
    this.refreshState = null;
    const {refreshEl, refreshIconEl} = this.refs;
    const {style} = refreshEl;
    refreshIconEl.classList.remove('rotate');
    refreshIconEl.classList.remove('loading');

    style.transition = '';
    style.webkitTransition = '';
    style.webkitTransform = 'translate3d(0, 0, 0)';
    style.transform = 'translate3d(0, 0, 0)';

    this.setState({
      refreshText: pullDownText[0]
    });
    this.alloyTouch.to(0);
  };

  // 加载更多
  loadMore = (e) => {
    if (e) {
      e.stopImmediatePropagation();
    }

    if (this.loadMoreState === null || this.loadMoreState === 'loading') {
      return;
    }
    this.loadMoreState = 'loading';
    const {loadMoreCallback, lockInTime, pullUpText} = this.props;
    const {loadMoreIconEl} = this.refs;
    loadMoreIconEl.classList.add('loading');
    this.setState({
      loadMoreText: pullUpText[2]
    });

    if (loadMoreCallback && typeof loadMoreCallback === 'function') {
      if (lockInTime > 0) {
        clearTimeout(this.loadMoreTimoutId);
        this.loadMoreTimoutId = setTimeout(() => {
          loadMoreCallback().then(() => {
            this.resetLoadMoreState()
          }, () => {
            this.resetLoadMoreState(true)
          });
        }, lockInTime);
      } else {
        loadMoreCallback().then(() => {
          this.resetLoadMoreState()
        }, () => {
          this.resetLoadMoreState(true)
        });
      }
    } else {
      this.resetLoadMoreState();
    }
  };

  // 恢复加载更多原始状态
  resetLoadMoreState = (fail) => {
    const {pullUpText} = this.props;
    this.loadMoreState = null;
    const {loadMoreEl, loadMoreIconEl} = this.refs;
    loadMoreIconEl.classList.remove('rotate');
    loadMoreIconEl.classList.remove('loading');

    this.setState({
      loadMoreText: pullUpText[0]
    });
    loadMoreEl.style.visibility = 'hidden';
    if (this.offsetStart !== undefined || this.offsetEnd !== undefined) {
      const offset = fail ? this.offsetStart : this.offsetEnd;
      if (offset) {
        this.alloyTouch.to(offset);
      }
    }
  };

  // 选择加载更多
  renderLoadMore() {
    const {loadMoreText} = this.state;
    const {loadMore, loadMoreProcessIcon, disablePullUp, pullUpText} = this.props;
    if (loadMore) {
      return (
        <div ref="loadMoreEl" className="alloy-load-more">
          <div ref="loadMoreIconEl"
               className={`alloy-load-more-icon${!loadMoreProcessIcon || disablePullUp ? ' hide' : ''}`}></div>
          <div className="alloy-load-more-text">{disablePullUp ? pullUpText[3] : loadMoreText}</div>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      children, className, header, footer, refresh, enableText
    } = this.props;
    const {refreshText} = this.state;

    return (
      <div className={`alloy-panel ${className}`}>
        {header ? (<div className="alloy-header" ref="header">{header}</div>) : null}
        {
          refresh ? (<div ref="refreshEl" className="alloy-refresh">
            <div className="alloy-refresh-icon-wrapper">
              <div ref="refreshIconEl" className="alloy-refresh-icon"></div>
            </div>
            {enableText ? (<div className="alloy-refresh-text">{refreshText}</div>) : null}
          </div>) : null
        }
        <div className="alloy-wrapper" ref="wrapper">
          <div className="alloy-scroller" ref="scroller">
            {children}
          </div>
        </div>
        {this.renderLoadMore()}
        {footer ? (<div className="alloy-footer" ref="footer">{footer}</div>) : null}
      </div>
    );
  }
}

export default ReactAlloyTouch;
