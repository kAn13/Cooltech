var gulp        = require('gulp'),
    jade        = require('gulp-jade'),
    compass     = require('gulp-compass'),
    browserSync = require('browser-sync'),
    browserify  = require('gulp-browserify'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    plumber     = require('gulp-plumber'),
    concat      = require('gulp-concat');

var
    paths = {
        jade : {
            location    : 'app/- dev/markups/**/*.jade',
            compiled    : 'app/- dev/markups/_pages/*.jade',
            destination : 'app/'
        },

        scss : {
            location    : 'app/- dev/styles/**/*.scss',
            entryPoint  : 'app/css/main.css'
        },

        compass : {
            cfgFile     : 'config.rb',
            cssFolder   : 'app/css/',
            scssFolder  : 'app/- dev/styles/',
            imgFolder   : 'app/img/'
        },

        js : {
            location    : 'app/- dev/scripts/main.js',
            plugins     : 'app/- dev/scripts/_plugins/*.js',
            destination : 'app/js/'
        },

        browserSync : {
            baseDir     : 'app/',
            watchPaths  : ['app/*.html', 'app/css/*.css', 'app/js/*.js']
        }
    }

gulp.task('jade', function() {
    gulp.src(paths.jade.compiled)
        .pipe(plumber())
        .pipe(jade({
             pretty: '\t'
        }))
        .pipe(gulp.dest(paths.jade.destination))
});

gulp.task('compass', function() {
    gulp.src(paths.scss.location)
        .pipe(plumber())
        .pipe(compass({
            config_file: paths.compass.cfgFile,
            css: paths.compass.cssFolder,
            sass: paths.compass.scssFolder,
            image: paths.compass.imgFolder
        }));
});


gulp.task('server', function() {
  browserSync({
    port: 9000,
    server: {
      baseDir: paths.browserSync.baseDir
    }
  });
});


gulp.task('plugins', function() {
    return gulp.src(paths.js.plugins)
        .pipe(plumber())
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.destination));
});

gulp.task('scripts', function() {
    return gulp.src(paths.js.location)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(paths.js.destination));
});


gulp.task('watch', function(){
    gulp.watch(paths.jade.location, ['jade']);
    gulp.watch(paths.scss.location, ['compass']);
    gulp.watch(paths.js.location, ['scripts']);
    gulp.watch(paths.js.plugins, ['plugins']);
    gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});


gulp.task('default', ['jade', 'compass', 'plugins', 'scripts', 'server', 'watch']);
