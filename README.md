# React AlloyTouch

This is a react component for AlloyTouch.

## Install

```
npm install react-alloyTouch --save
```

## Example

```
npm install
gulp example
```

http://localhost:9090


## Online Example

http://reactjs-ui.github.io/react-alloyTouch/

## Build Example
第一次需要先执行前两步操作，再执行第三步。以后修改例子后，只需要执行第三步即可

* 创建 gh-pages 分支，**在执行 git subtree add 命令之前，需确保 gh-pages 分支下至少存在一个文件**
```
git checkout -b gh-pages
rm -rf *     //隐藏文件需要单独删除，结合命令 ls -a
git add -A
vim .gitignore //输入一些内容
git add README.md
git commit -m "init branch gh-pages"
git push --set-upstream origin gh-pages
git push
git checkout master
```

* 把分支 gh-pages 添加到本地 subtree 中，执行该命令前，请确保 examples-dist 文件夹不存在

```
git subtree add --prefix=examples-dist origin gh-pages --squash
```
  
* 生成在线 examples
```
gulp example:build
git add -A examples-dist
git commit -m "Update online examples"
git subtree push --prefix=examples-dist origin gh-pages --squash
git push
```

## Usage

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactAlloyTouch from 'react-alloyTouch';
import './sass/example.scss'; // 自己定义

// 初始化 tapEvent 事件, 移动端
injectTapEventPlugin();

class AlloyTouchSimple extends Component {
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
      <ReactAlloyTouch {...props}>
        <ol className="example-list">
          {contents.map((item) => {
            return item;
          })}
        </ol>
      </ReactAlloyTouch>
    );
  }
}

render(
  <AlloyTouchSimple />, document.getElementById('layout')
);

```

## Options

| 选项        | 类型   |  功能  |
| --------   | ----- | ---- |
| children | PropTypes.node| 待渲染的内容|
| className | PropTypes.string| 自定义 className|
| header | PropTypes.element| 头部|
| footer | PropTypes.element| 底部|
| options | PropTypes.object| AlloyTouch 组件选项|
| lockInTime | PropTypes.number| 延迟刷新或加载|
| enableText | PropTypes.bool| 是否显示滚动条|
| refresh | PropTypes.bool| 是否下拉刷新|
| refreshThreshold | PropTypes.number| 设置刷新页面时，距离顶部临界值 |
| refreshCallback | PropTypes.func| 刷新回调函数|
| pullDownText   | PropTypes.array | 下拉显示文本内容 |
| loadMore | PropTypes.bool | 是否加载更多 |
| loadMoreThrottle | PropTypes.number | 设置加载更多，距离最底部临界值 |
| loadMoreCallback  | PropTypes.func | 加载更多回调函数 |
| pullUpText  | PropTypes.array | 上拉显示文本内容 |
| loadMoreProcessIcon  | PropTypes.bool | 加载更多过程图标 |
| disablePullUp  | PropTypes.bool | 对于上拉加载更多时，如果没有更多记录时，禁止上滑 |

对于 AlloyTouch 组件选项 options 设置，看[官方说明](https://github.com/AlloyTeam/AlloyTouch)

## Build

```
gulp build
```

## Publish

```
gulp publish
```

## Issue

https://github.com/reactjs-ui/react-alloyTouch/issues

## Version

Please view [here](./CHANGELOG.md)
