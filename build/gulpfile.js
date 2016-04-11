var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var path = require('path');

gulp.task('default', function () {
  nodemon({
    script: '../app.js',
    execMap: { 
        "js": "node --harmony"
    },
    ext: 'js jade scss css png jpg gif',
    env: { 'NODE_ENV': 'development' },
    watch: ['../'],
    tasks: ['sass']
  })
});

gulp.task('sass', function () {
  gulp.src('../static/scss/**/*.scss' )
    .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
    .pipe(gulp.dest('../static/css'));
});