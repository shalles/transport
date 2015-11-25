
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    fecmd = require('gulp-fecmd');

var release = false;
function script(){
    var stream = 
        gulp.src(['start/js/dev/index.js', 'start/js/dev/fileworker.js'])
            .pipe(fecmd());
        stream = (release ? stream.pipe(uglify()) : stream)
            .pipe(gulp.dest('start/js/'));
}

gulp.task('script', function(){
    script();
})

gulp.task('watch', ['script'], function(){
    gulp.watch('start/js/dev/**/**.js', ['script']);
})

gulp.task('release', ['script'], function(){
    release = true;
    script();
})

gulp.task('default', ['watch'], function(){})