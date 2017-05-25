import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins({
  pattern: ['gulp-*', 'del']
});

// 清理临时和打包目录
gulp.task('clean', () => {
  return $.del(['dist'], {force: true});
});

// 清理例子 dist
gulp.task('clean:example', () => {
  return $.del(['examples-dist'], {force: true});
});