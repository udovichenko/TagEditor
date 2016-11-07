var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    // cssmin = require('gulp-cssnano'),
    rigger = require('gulp-rigger');

gulp.task('libsConcat', function () {
    gulp.src(['src/libs.js']) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(uglify()) //Сожмем наш js
        .pipe(gulp.dest('demo/js')); //Выплюнем готовый файл в build
});

gulp.task('default', ['libsConcat']);