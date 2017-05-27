import childProcess from 'child_process';
import gulp from 'gulp';
import chalk from 'chalk';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

gulp.task('copy-publish', () => {
  return gulp
    .src(['README.md'])
    .pipe($.copy('publish'))
});

// 发布到 npm 中
gulp.task('publish', () => {
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
