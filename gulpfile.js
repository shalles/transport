
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    fecmd = require('gulp-fecmd');
var dev = false;
gulp.task('script', function(){
    var stream = 
        gulp.src('start/js/dev/index.js')
            .pipe(fecmd());
        stream = (dev ? stream.pipe(uglify()) : stream)
            .pipe(gulp.dest('start/js/'));
})

gulp.task('watch', ['script'], function(){
    gulp.watch('start/js/dev/**/**.js', ['script']);
})

gulp.task('dev', ['watch'], function(){
    dev = true;
})

gulp.task('default', ['watch'], function(){})