const gulp = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const gulpsync = require('gulp-sync')(gulp);
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const plugins = require('gulp-load-plugins')();

const SRC = 'src';
const PUBLIC = './';


gulp.task('pug', () =>
  gulp
    .src(SRC + '/*.pug')
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
    .pipe(plugins.pug())
    .pipe(gulp.dest(PUBLIC))
);


gulp.task('scss', () =>
  gulp
    .src(SRC + '/main.scss')
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer(['last 2 versions', '> 1%'], { cascade: false }))
    .pipe(plugins.csscomb())
    .pipe(plugins.cssnano())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(PUBLIC))
);


gulp.task('js', () =>
  gulp
    .src(SRC + '/main.js')
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError(err => ({
        title: 'Webpack',
        message: err.message
      }))
    }))
    .pipe(named())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(PUBLIC))
);


gulp.task('sprite', () => {
  var spriteData = gulp
    .src(SRC + '/blocks/*/icons/*.*')
    .pipe(plugins.spritesmith({
      imgName: 'icons.png',
      cssName: '_icons.scss',
      cssFormat: 'scss',
      algorithm: 'left-right',
      padding: 20,
      cssTemplate: '.sprite.template'
    }));
  spriteData.img.pipe(gulp.dest(SRC));
  spriteData.css.pipe(gulp.dest(SRC + '/scss-common'));
});


gulp.task('cleanImg', () => del(PUBLIC + '/images'));

gulp.task('img', ['cleanImg', 'sprite'], () =>
  gulp
    .src([SRC + '/blocks/**/img/*.*', SRC + '/icons.png'])
    .pipe(plugins.imagemin([
      plugins.imagemin.gifsicle({
        interlaced: true,
        optimizationLevel: 3
      }),
      imageminJpegRecompress({
        loops: 4,
        min: 50,
        max: 65,
        quality: 'high',
        strip: true,
        progressive: true
      }),
      imageminPngquant({quality: '50-65'}),
      plugins.imagemin.svgo({removeViewBox: true})
    ]))
    .pipe(gulp.dest(PUBLIC + '/images'))
);


gulp.task('font', () =>
  gulp
    .src('src/font/**/*')
    .pipe(gulp.dest(PUBLIC))
);


gulp.task('htmllint', ['pug'], () =>
  gulp
  .src(PUBLIC + '/*.html')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.htmlhint.reporter('htmlhint-stylish'))
  .pipe(plugins.htmlhint.failReporter({ suppress: true }))
);


gulp.task('csslint', ['scss'], () =>
  gulp
    .src('src/css/styles.css')
    .pipe(plugins.csslint())
    .pipe(plugins.csslint.formatter())
    .pipe(gulp.dest(PUBLIC + '/*.css'))
);


gulp.task('default', gulpsync.sync(['font', 'img', 'pug', 'scss']), () => {
  browserSync.init({
    server: { baseDir: PUBLIC },
    open: false
  });
  browserSync.watch(SRC).on('change', () => {
    gulp.watch([SRC + '/blocks/**/img/*.*', SRC + '/img/*.png'], gulpsync.sync(['img', browserSync.reload]));
    gulp.watch(SRC + '/blocks/**/*.pug', gulpsync.sync(['pug', browserSync.reload]));
    gulp.watch([SRC + '/blocks/**/*.scss', SRC + '/scss/**/*.scss'], gulpsync.sync(['scss', browserSync.reload]));
    gulp.watch(SRC + '/blocks/**/*.js', gulpsync.sync(['js', browserSync.reload]));
  });
});
