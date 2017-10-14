var gulp = require('gulp');
var uglify = require('gulp-uglify')

gulp.task('default', function() {
    gulp.src('Ypaint.js')
        .pipe(uglify({ mangle: true, compress: true }))
        .pipe(gulp.dest('./dist'))
});