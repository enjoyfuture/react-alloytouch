import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactCarousel from '../src/scripts/ReactCarousel';
import './sass/example.scss';

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
  return (
    <ReactCarousel items={items}/>
  );
};

render(
  <ReactCarouselExample />, document.getElementById('layout')
);
