import React, {Component} from 'react';
import {render} from 'react-dom';
import './sass/example.scss';

const Index = () => {
  return (
    <div className="example">
      <h3>React AlloyTouch 例子</h3>
      <ol className="example-list">
        <li>
          <a href="./pull-refresh.html" target="_blank">下拉刷新，上拉加载更多</a>
        </li>
        <li>
          <a href="./header-footer.html" target="_blank">带头部和底部的下拉刷新，上拉加载更多</a>
        </li>
      </ol>
    </div>
  );
};

render(<Index/>, document.getElementById('layout'));
