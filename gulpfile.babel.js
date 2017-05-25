import gulp from 'gulp';
import requireDir from 'require-dir';

requireDir('./gulp');

// 默认任务
gulp.task('default', () => {
  gulp.start('build');
});
