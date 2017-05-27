import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactAlloyTouch from '../js/index';
import './sass/example.scss';

const ReactAlloyTouchExample = () => {
  const len = 100;
  const content = [];
  for (let i = 0; i < len; i++) {
    content.push(i);
  }
  return (
    <ReactAlloyTouch>
      <div>
        {content.map((it) => {
          return (
            <p key={it}>{`测试内容 ${it + 1}`}</p>
          );
        })}
      </div>
    </ReactAlloyTouch>
  );
};

render(
  <ReactAlloyTouchExample />, document.getElementById('layout')
);
