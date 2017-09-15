# React AlloyTouch

This is a react component for AlloyTouch.

## Install

```
npm install react-alloytouch --save
```

## Usage

### Pull Component

#### example code

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {ReactPull} from 'react-alloytouch';
import 'react-alloytouch/sass/pull.scss'; // 或者 import 'react-alloytouch/css/pull.css';
import './sass/example.scss'; // 自定义样式

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

```

#### Options

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
| loadedRecoilTime| PropTypes.number|  加载完更多数据回弹时间| 
|  moveForwardOffset|  PropTypes.number|  加载完更多数据时，向前推进的距离| 

对于 AlloyTouch 组件选项 options 设置，看[官方说明](https://github.com/AlloyTeam/AlloyTouch)

### Carousel Component

#### example code

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import {ReactCarousel} from 'react-alloytouch';
import 'react-alloytouch/sass/carousel.scss'; // 或者 import 'react-alloytouch/css/carousel.css';
import './sass/example.scss'; // 自定义样式

const ReactCarouselExample = () => {

  const items = [{
    image: 'http://alloyteam.github.io/AlloyTouch/example/asset/ci1.jpg',
    link: 'http://jd.com'
  }, {
    image: 'http://alloyteam.github.io/AlloyTouch/example/asset/ci2.jpg',
  }, {
    image: 'http://alloyteam.github.io/AlloyTouch/example/asset/ci3.jpg',
    link: 'http://jd.com'
  }, {
    image: 'http://alloyteam.github.io/AlloyTouch/example/asset/ci4.jpg'
  }];
  const events = {
    onTouchTap: () => {
      console.info('这是个测试！');
    }
  };

  return (
    <ReactCarousel items={items}/>
  );
};

render(
  <ReactCarouselExample />, document.getElementById('layout')
);

```

#### Options

| 选项        | 类型   |  功能  |
| --------   | ----- | ---- |
| className | PropTypes.string| 自定义 className|
| prefix | PropTypes.string| 样式前缀|
| options | PropTypes.object| AlloyTouch 组件选项|
| items | PropTypes.array| 轮播图|
| active | PropTypes.number| 当前活动轮播图|
| autoPlay | PropTypes.oneOfType([PropTypes.bool, PropTypes.number])| 是否自动播放|
| events |  PropTypes.object| 自定义各种事件|

## Example

```
npm install
npm start
```

http://localhost:9090


## Online Example

http://reactjs-ui.github.io/react-alloytouch/

## Build Example
第一次需要先执行前两步操作，再执行第三步。以后修改例子后，只需要执行第三步即可

1. 创建 gh-pages 分支，**在执行 git subtree add 命令之前，需确保 gh-pages 分支下至少存在一个文件**
```
git checkout -b gh-pages
rm -rf *     //隐藏文件需要单独删除，结合命令 ls -a
vim .gitignore //输入一些内容
git add .
git commit -m "init branch gh-pages"
git push --set-upstream origin gh-pages
git checkout master
```

2. 把分支 gh-pages 添加到本地 subtree 中，执行该命令前，请确保 examples-dist 文件夹不存在

```
git subtree add --prefix=examples-dist origin gh-pages --squash
```

3. 生成在线 examples

```
npm run build:examples
git add examples-dist
git commit -m "Update online examples"
git subtree pull --prefix=examples-dist origin gh-pages
git subtree push --prefix=examples-dist origin gh-pages --squash
git push
```

4 使用以下命令一键发布在线例子
```bash
npm run examples:publish
```

## Build

```
npm run build
```

## Publish

```
npm run build:publish
```

## Issue

https://github.com/reactjs-ui/react-alloytouch/issues

## Change Log

Please view [here](./CHANGELOG.md)
