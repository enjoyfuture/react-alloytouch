import childProcess from 'child_process';
import gulp from 'gulp';
import chalk from 'chalk';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins({
  pattern: ['gulp-*', 'del']
});

// 清理临时和打包目录
gulp.task('clean-publish', () => {
  return $.del(['publish/*', '!publish/package.json']);
});

gulp.task('copy-dist', ['build'], () => {
  return gulp.src(['src/**', 'dist/**'])
    .pipe(gulp.dest('publish'));
});

// 发布到 npm 中
gulp.task('publish', ['copy-dist'], () => {
  const {exec} = childProcess;
  exec('cd publish && npm publish && cd ..', (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.magenta(error));
      return;
    }
    if (stdout) {
      console.log(chalk.magenta(`stdout: ${stdout}`));
    }
    if (stderr) {
      console.log(chalk.magenta(`stderr: ${stderr}`));
    }
  });
});
