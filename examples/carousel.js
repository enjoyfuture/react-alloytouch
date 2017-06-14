import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactCarousel from '../js/ReactCarousel';
import '../sass/carousel.scss';
import './sass/example.scss';

// 初始化 tapEvent 事件, 移动端
injectTapEventPlugin();

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
    <ReactCarousel items={items} events={events}/>
  );
};

render(
  <ReactCarouselExample />, document.getElementById('layout')
);
