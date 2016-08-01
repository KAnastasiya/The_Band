'use strict';

const gulp = require('gulp'),
  browserSync = require('browser-sync'),
  del = require('del'),
  imageminJpegRecompress = require('imagemin-jpeg-recompress'),
  imageminPngquant = require('imagemin-pngquant'),
  gulpsync = require('gulp-sync')(gulp),
  webpack = require('webpack-stream'),
  named = require('vinyl-named');

const plugins = require('gulp-load-plugins')();

// Pug to Html
gulp.task('pug', () => {
  return gulp.src('src/dev/*.pug')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.pug({ pretty: true }))
  .pipe(gulp.dest('src/'));
});

// SCSS to CSS
gulp.task('scss', () => {
  return gulp.src('src/dev/main.scss')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.autoprefixer(['last 2 versions', '> 1%'], { cascade: false }))
  .pipe(plugins.csscomb())
  .pipe(plugins.cssnano())
  .pipe(plugins.rename({suffix: '.min'}))
  .pipe(plugins.sourcemaps.write())
  .pipe(gulp.dest('src'));
});

// ES2016 to common JS
// TODO: need stop this task after its finish
gulp.task('script', () => {
  return gulp.src('src/dev/main.js')
  .pipe(plugins.plumber({
    errorHandler: plugins.notify.onError(err => ({
      title: 'Webpack',
      message: err.message
    }))
  }))
  .pipe(named())
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(plugins.rename({suffix: '.min'}))
  .pipe(gulp.dest('src'));
});

// Creation icons sprite
gulp.task('sprite', () => {
  var spriteData = gulp.src('src/dev/blocks/*/icons/*.*')
    .pipe(plugins.spritesmith({
      imgName: 'icons.png',
      cssName: '_icons.scss',
      cssFormat: 'scss',
      algorithm: 'left-right',
      padding: 20,
      cssTemplate: 'handlebarsStr.css.handlebars'
    }));

  spriteData.img.pipe(gulp.dest('./src/img'));
  spriteData.css.pipe(gulp.dest('./src/dev/scss-common'));
});

// Images optimization
gulp.task('img', () => {
  return gulp.src(['src/dev/blocks/**/img/*.*', 'src/img/icon.png', 'src/server/**/**/*.png'])
  .pipe(plugins.imagemin([
    plugins.imagemin.gifsicle({
      interlaced: true,
      optimizationLevel: 3
    }),
    imageminJpegRecompress({
      loops: 4,
      min: 65,
      max: 95,
      quality: 'high',
      strip: true,
      progressive: true
    }),
    imageminPngquant({quality: '65-80'}),
    plugins.imagemin.svgo({removeViewBox: true})
  ]))
  .pipe(gulp.dest('src/img'));
});

// Html and CSS linters
gulp.task('htmllint', ['pug'], () => {
  gulp.src('src/*.html')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.htmlhint.reporter('htmlhint-stylish'))
  .pipe(plugins.htmlhint.failReporter({ suppress: true }));
});

gulp.task('csslint', ['scss'], () => {
  return gulp.src('src/css/styles.css')
    .pipe(plugins.csslint())
    .pipe(plugins.csslint.reporter())
    .pipe(gulp.dest('src/css'));
});

// Build task
gulp.task('clean', () => {
  return del('build');
});

gulp.task('build', ['clean'], () => {
  let html = gulp.src('src/*.html')
  .pipe(gulp.dest('build/'));

  let css = gulp.src('src/*.css')
  .pipe(gulp.dest('build'));

  let scripts = gulp.src(['src/*.js'])
  .pipe(gulp.dest('build'));

  let favicon = gulp.src(['src/favicon.*'])
  .pipe(gulp.dest('build'));

  let icons = gulp.src(['src/img/icons.png'])
  .pipe(gulp.dest('build'));

  let fonts = gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('build/fonts'));

  let img = gulp.src(['src/img/**/*'])
  .pipe(gulp.dest('build/images'));

  let data = gulp.src(['src/server/*.json'])
  .pipe(gulp.dest('build/server'));

  let audio = gulp.src(['src/server/tracks/**/*.mp3', 'src/server/tracks/**/*.ogg'])
  .pipe(gulp.dest('build/server/tracks'));
});

// Server and watch mode
// TODO: previously need start task 'script'
gulp.task('serve', gulpsync.sync(['pug', 'scss', 'build']), () => {
  browserSync.init({
    server: { baseDir: 'build' },
    notify: false
  });

  browserSync.watch('src/dev').on('change', () => {
    gulp.watch('src/dev/blocks/**/*.pug', gulpsync.sync(['pug', 'build', browserSync.reload]));
    gulp.watch(['src/dev/blocks/**/*.scss', 'src/dev/scss/**/*.scss'], gulpsync.sync(['scss', 'build', browserSync.reload]));
    gulp.watch('src/dev/blocks/**/*.js', gulpsync.sync(['script', 'build', browserSync.reload]));
  });
});

// Prepair for GitHub
gulp.task('gitHub', () => {
  return gulp.src('build/**/**/*.*')
  .pipe(gulp.dest('./'));
});
