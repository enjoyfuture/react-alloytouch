import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactSwiper from '../js/ReactSwiper';
import '../sass/carousel.scss';
import './sass/example.scss';

// 初始化 tapEvent 事件, 移动端
injectTapEventPlugin();

class ReactSwiperExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: 30,
      disablePullUp: false
    };
  }


  handleTouchTap = (e) => {
    console.info('测试下拉刷新插件是否与 Tap 事件冲突');
  };

  handleSlideChange = (currentIndex) => {
    console.log(`currentIndex is ${currentIndex}`)
    const btns = document.querySelectorAll('input')
    Array.prototype.forEach.call(btns, (item, index) => {
      if (index === currentIndex) {
        item.style.color = 'red'
      } else {
        item.style.color = 'black'
      }
    })
  };

  handleST = (index) => {

    return function () {
      const {swiper} = this.refs
      swiper.SlideTo(index)

      // slideto()

      console.log(swiper)
    }.bind(this)

  }

  render() {

    const swiper1 = (
      <div>123</div>
    )
    const swiper2 = (
      <div>456</div>
    )

    const carouselItems = [swiper1, swiper2];

    return (
      <div>
        <div><input onClick={this.handleST(0)} type="button" value='button'/><input onClick={this.handleST(1)} type="button" value='button'/></div>

        <ReactSwiper ref="swiper" autoPlay={false} items={carouselItems} showDot={false} onSlideChange={this.handleSlideChange}/>
      </div>
    );
  }
}

render(
  <ReactSwiperExample />, document.getElementById('layout')
);
