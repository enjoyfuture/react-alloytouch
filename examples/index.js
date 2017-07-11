import React, {Component} from 'react';
import {render} from 'react-dom';
import './sass/example.scss';

const Index = () => {
  return (
    <div className="example">
      <h3>React AlloyTouch 例子</h3>
      <ol className="example-list">
        <li>
          <a href="./simple.html" target="_blank">简单例子</a>
        </li>
        <li>
          <a href="./pull.html" target="_blank">下拉刷新，上拉加载更多</a>
        </li>
        <li>
          <a href="./header-footer.html" target="_blank">带头部和底部的下拉刷新，上拉加载更多</a>
        </li>
        <li>
          <a href="./carousel.html" target="_blank">轮播</a>
        </li>
        <li>
          <a href="./pull-carousel.html" target="_blank">下拉刷新中包含轮播图</a>
        </li>
        <li>
          <a href="./pull-carousel2.html" target="_blank">下拉刷新中包含轮播图2</a>
        </li>
        <li>
          <a href="./tabs-carousel.html" target="_blank">自定义轮播内容+tabs</a>
        </li>
      </ol>
    </div>
  );
};

render(<Index/>, document.getElementById('layout'));
