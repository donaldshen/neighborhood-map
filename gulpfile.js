var gulp = require('gulp'),
// sourcemaps = require('gulp-sourcemaps'),
browserSync = require('browser-sync').create();
// htmlmin = require('gulp-htmlmin'),
// uglify = require('gulp-uglify'),
// cleancss = require('gulp-clean-css');


// Paths to various files
var paths = {
    scripts: ['src/**/*.js'],
    styles: ['src/**/*.css'],
    htmls: ['src/*.html']
};


gulp.task('htmls', function () {
    return gulp.src(paths.htmls)
    // .pipe(htmlmin({
    //     collapseWhitespace: true,
    //     minifyCSS: true,
    //     removeComments: true,
    // }))
    .pipe(gulp.dest('dist'));
})


gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
    // .pipe(uglify())
    .pipe(gulp.dest('dist'));
});


// Launches a test webserver
gulp.task('browser', function (){
    browserSync.init({
            port: 8000,
        server: {
            baseDir: "dist"
        },
        browser: 'google chrome',
        files: ['dist/**/*']
    });
});


gulp.task('styles', function () {
    // var postcss      = require('gulp-postcss');
    // var autoprefixer = require('autoprefixer');
    return gulp.src(paths.styles)
    // .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    // .pipe(cleancss())
    .pipe(gulp.dest('dist'))
});


gulp.task('default', ['htmls', 'styles', 'scripts' ,'browser'], function () {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.htmls, ['htmls']);
});
