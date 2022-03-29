const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const csso = require('gulp-csso');
const connect = require('gulp-connect-php');
const browserSync = require('browser-sync');

const server = function(cb) {

    browserSync.init({
        notify: false,
        proxy: 'http://localhost/WordpressThemeBuildconfig/',
        port: 3000,
        open: true
    });

    cb();

}

const css = function() {
    return gulp.src("wp-content/themes/wordpressthemebuildconfig/includes/sass/main.scss")
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: "compressed" // compressed | expanded
            }).on("error", sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(rename({
            suffix: ".min",
            basename: "styles"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wp-content/themes/wordpressthemebuildconfig/includes/css"))
        .pipe(browserSync.stream());
}

const watch = function(cb) {
    gulp.watch("wp-content/themes/wordpressthemebuildconfig/includes/sass/*.scss", gulp.series(css));
    gulp.watch('**/*.php').on('change', browserSync.reload);
    gulp.watch('**/*.js').on('change', browserSync.reload);
    cb();
}

exports.default = gulp.series(css, server, watch);
exports.css = css;
exports.watch = watch;