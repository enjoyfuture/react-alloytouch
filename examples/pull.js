import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactPull from '../js/ReactPull';
import './sass/example.scss';

// 初始化 tapEvent 事件, 移动端
injectTapEventPlugin();

class ReactPullExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: 30,
      disablePullUp: false
    };
  }

  refreshCallback = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = false;
        if (Math.random() > 0.2) {
          result = true;
        }
        if (result) {
          this.setState({
            items: 30,
            disablePullUp: false
          }, () => {
            resolve();
          });
        } else {
          reject(new Error('错误'));
        }
      }, 1000);
    }).then(() => {
      console.info('刷新成功！');
    }, () => {
      console.info('刷新失败！');
    });
  };

  loadMoreCallback = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = false;
        if (Math.random() > 0.2) {
          result = true;
        }
        if (result) {
          this.setState({
            items: this.state.items + 10,
            disablePullUp: this.state.items >= 60
          }, () => {
            resolve();
          });
        } else {
          reject(new Error('错误'));
        }
      }, 1000);
    }).then(() => {
      console.info('加载更多成功！');
    }, () => {
      console.info('加载更多失败！');
    });
  };

  handleTouchTap = (e) => {
    console.info('测试下拉刷新插件是否与 Tap 事件冲突');
  };

  render() {
    const contents = [];
    const {items, disablePullUp} = this.state;

    for (let i = items; i > 0; i--) {
      if (i < 10) {
        contents.push(<li key={i}><a href="http://www.sina.com">这里放置真实显示的DOM内容</a> {i}</li>);
      } else {
        contents.push(<li key={i} onTouchTap={this.handleTouchTap}>这里放置真实显示的DOM内容 {i}</li>);
      }
    }

    const props = {
      refreshCallback: this.refreshCallback,
      loadMoreCallback: this.loadMoreCallback,
      refresh: true,
      loadMore: true,
      disablePullUp,
    };

    return (
      <ReactPull {...props}>
        <ol className="example-list">
          {contents.map((item) => {
            return item;
          })}
        </ol>
      </ReactPull>
    );
  }
}

render(
  <ReactPullExample />, document.getElementById('layout')
);
