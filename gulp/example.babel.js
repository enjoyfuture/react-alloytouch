import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import opn from 'opn';
import exampleConfig from '../webpack.config.example.babel';
import exampleDistConfig from '../webpack.config.example.dist.babel';

const $ = gulpLoadPlugins();
const {webpackConfig, ip, port} = exampleConfig;

gulp.task('copy-eruda', () => {
  return gulp.src('node_modules/eruda/eruda.min.js')
    .pipe(gulp.dest('examples'));
});

// 运行 example
gulp.task('example', () => {
  gulp.start(['scss']);
  gulp.watch('src/sass/*.scss', ['scss']);

  // Start a webpack-dev-server
  const compiler = webpack(webpackConfig);
  new WebpackDevServer(compiler, webpackConfig.devServer)
    .listen(port, ip, (err) => {
      if (err) {
        throw new $.util.PluginError('webpack-dev-server', err);
      }
      // Server listening
      $.util.log('[webpack-dev-server]', `http://${ip}:${port}/`);

      // keep the server alive or continue?
      opn(port === '80' ? `http://${ip}` : `http://${ip}:${port}/`, {app: 'google chrome'});
    });
});

// 打包编译例子
gulp.task('example:build', ['clean:example'], () => {
  const compiler = webpack(exampleDistConfig);
  // run webpack
  compiler.run((err, stats) => {
    if (err) {
      throw new $.util.PluginError('example:build', err);
    }
    $.util.log('[example:build]', stats.toString({
      colors: true
    }));
  });
});
