var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require('gulp-rename');
var gutil = require('gulp-util');


var path = {
  html : {
    src : ['src/views/*.html'],
    dest : 'dist/views'
  },
  script : {
    src : ['src/scripts/*.js', 'src/scripts/modules/*.js'],
    dest : 'dist/scripts'
  },
  css : {
    src : ['src/style/*.scss', 'src/style/*/*.scss'],
    dest : 'dist/style'
  },
  images : {
    src : ['src/images/*'],
    dest : 'dist/images'
  },
  fonts : {
    src : ['src/fonts/'],
    dest : 'dist/fonts'
  }
}

function popupIconEnv() {
  if(gutil.env.env === 'prod') {
    path.popupicons = {};
    path.popupicons.src = ['src/icon-prod/*'];
    path.popupicons.dest = 'dist/images';
  }
  else {
    path.popupicons = {};
    path.popupicons.src = ['src/icon-dev/*'];
    path.popupicons.dest = 'dist/images';
  }


}

popupIconEnv();

var scripts = {
  popup : [
    './src/scripts/modules/jquery-3.1.1.min.js',
    './src/scripts/popup.js'
  ],
  options : [
    './src/scripts/modules/jquery-3.1.1.min.js',
    './src/scripts/modules/main.js',
    './src/scripts/options.js'
  ]
}

gulp.task('sass', function() {
  return gulp.src(path.css.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(gulp.dest(path.css.dest))
})
gulp.task('sass:watch', function() {
  gulp.watch(path.css.src, ['sass']);
})

gulp.task('html', function() {
  return gulp.src(path.html.src)
    .pipe(gulp.dest(path.html.dest));
})
gulp.task('html:watch', function() {
  gulp.watch(path.html.src, ['html']);
})

gulp.task('manifest', function() {
  return gulp.src('./src/manifest.json')
    .pipe(gulp.dest('./dist/'))
})
gulp.task('manifest:watch', function() {
  gulp.watch('./src/manifest.json', ['manifest']);
})
gulp.task('images', function() {
  return gulp.src(path.images.src)
    .pipe(gulp.dest(path.images.dest))
})

gulp.task('images:watch', function() {
  gulp.watch('./src/images/*.svg', ['images']);
})
gulp.task('popupicons', function() {
  return gulp.src(path.popupicons.src)
    .pipe(gulp.dest(path.popupicons.dest));
})
gulp.task('popupicons:watch', function() {
  gulp.watch(path.popupicons.src, ['popupicons']);
})
gulp.task('fonts', function() {
  return gulp.src(['./src/fonts/*'])
    .pipe(gulp.dest('./dist/fonts/'))
})






gulp.task('js:popup', function() {
  return gulp.src(scripts.popup)
    .pipe(concat('popup.js'))
    .pipe(gulp.dest('./dist/scripts/'));
})


gulp.task('prodjs:popup', function() {
  return gulp.src(scripts.popup)
    .pipe(concat('popup.js'))
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(rename('popup.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts/'));
})






gulp.task('js:options', function() {
  return gulp.src(scripts.options)
    .pipe(concat('options.js'))
    .pipe(gulp.dest('./dist/scripts/'));
})

gulp.task('prodjs:options', function() {
  return gulp.src(scripts.options)
    .pipe(concat('options.js'))
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(rename('options.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts/'));
})






gulp.task('js', ['js:popup', 'js:options'])
gulp.task('prodjs', ['prodjs:popup', 'prodjs:options'])
gulp.task('js:watch', function() {
  gulp.watch(path.script.src, ['js'])
})

gulp.task('prod', ['sass', 'html', 'prodjs', 'images', 'popupicons', 'manifest', 'fonts']);
gulp.task('build', ['sass', 'html', 'js', 'images', 'popupicons', 'manifest', 'fonts']);
gulp.task('dev', ['build', 'html:watch', 'sass:watch', 'js:watch', 'images:watch', 'popupicons:watch', 'manifest:watch']);
