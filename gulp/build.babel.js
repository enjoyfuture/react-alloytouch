import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import baseConfig from '../webpack.config.babel';

const $ = gulpLoadPlugins();

// webpack 编译函数
function compiler(config, callback) {
  const webpackCompiler = webpack(config);
  // run webpack
  webpackCompiler.run((err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack:build', err);
    }
    $.util.log('[webpack:build]', stats.toString({
      colors: true
    }));

    if (callback) {
      return callback();
    }
  });
}

// 用webpack 打包编译
gulp.task('webpack:build', () => {
  const config = Object.create(baseConfig);
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  );

  //先无压缩编译
  compiler(config, () => {
    //在回调函数中再压缩编译
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        },
        mangle: {
          except: [] // 设置不混淆变量名
        }
      })
    );
    config.output.filename = '[name].min.js';
    compiler(config);
  });
});

gulp.task('copy', ['clean', 'scss'], () => {
  return gulp.src('src/styles/index.css')
    .pipe(gulp.dest('dist/styles'));
});

//把 es6 解析为 es5
gulp.task('build', ['copy'], () => {
  gulp.start(['webpack:build']);
});

