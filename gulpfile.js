var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    prefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('server', function() {
    browserSync({
        server: {
            //     // baseDir: "./www"
            //     // directory: true
            //     // port: 3000
        }
    });

    // gulp.watch([
    //     '**/*.js',
    //     '**/*.html'
    // ]).on('change', function() {
    //     browserSync.reload();
    // });
});

gulp.task('css', function () {
    // console.log('gulp.task(css');
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(concat('tageditor.css'))
        //.pipe(sourcemaps.init())
        //.pipe(rigger()) //Прогоним через rigger
        .pipe(sass({
            //sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}))
        //.pipe(cssimport({}))
        // .pipe(importcss({}))
        .pipe(rename("tageditor.min.css"))
        .pipe(cssmin())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}));
});

gulp.task('watch', function(){
    watch(['**/*.html'], function(event, cb) {
        reload();
    });
    watch(['src/scss/**/*.scss'], function(event, cb) {
        gulp.start('css');
    });
    watch(['**/*.js'], function(event, cb) {
        reload();
    });
});

gulp.task('libsConcat', function () {
    return gulp.src(['src/libs.js']) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(uglify()) //Сожмем наш js
        .pipe(gulp.dest('demo/js')); //Выплюнем готовый файл в build
});

gulp.task('default', ['libsConcat', 'css', 'server', 'watch']);