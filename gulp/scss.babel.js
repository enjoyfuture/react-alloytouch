import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import chalk from 'chalk';
import autoprefixer from 'autoprefixer';
import flexbugs from 'postcss-flexbugs-fixes';

const $ = gulpLoadPlugins();

const scssOption = {
  outputStyle: 'expanded', // 不压缩，设为 compressed 表示压缩
  precision: 10, // 设置小数精度
  includePaths: ['.']
};

/**
 * 浏览器支持性参考 bootstrap 官方的支持，参见源码 postcss.js 的支持性说明
 * iOS：https://developer.apple.com/support/app-store/
 * Android：https://developer.android.com/about/dashboards/index.html
 */
const browsers = ['Chrome >= 35', 'Firefox >= 38',
  'Android >= 4.3', 'iOS >= 8', 'Safari >= 8', 'Opera >= 12'];

const postcssPlugins = [
  autoprefixer({
    flexbox: 'no-2009', // 不生成2009定义的 Flexbox
    browsers
  }),
  flexbugs
];

/**
 * 利用sass生成styles任务
 * [在线补齐前缀](http://autoprefixer.github.io/)
 * [浏览器列表](https://github.com/ai/browserslist)
 *
 */
gulp.task('scss', () => {
  return gulp.src('sass/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync(scssOption).on('error', $.sass.logError))
    .pipe($.postcss(postcssPlugins))
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest('publish/css'));
});

// 检测样式加前缀
gulp.task('css-pre', () => {
  const info = autoprefixer({
    browsers
  }).info();

  console.log(chalk.magenta(info));
});
