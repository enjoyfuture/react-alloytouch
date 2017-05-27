import AlloyTouch from 'alloytouch';

// 重新设置 AlloyTouch 方法
AlloyTouch.prototype.setOption = function (key, value) {
  this[key] = value;
};

export default AlloyTouch;
