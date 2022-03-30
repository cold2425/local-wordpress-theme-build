// config
const localhostUrl = "http://localhost/WordpressThemeBuildconfig/";
const themePath = "wp-content/themes/wordpressthemebuildconfig";

// reuqire
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const csso = require("gulp-csso");
const connect = require("gulp-connect-php");
const browserSync = require("browser-sync");

const server = function(cb) {
    browserSync.init({
        notify: false,
        proxy: localhostUrl,
        port: 3000,
        open: true
    });
    cb();
}

const css = function() {
    return gulp.src(themePath + "/includes/sass/main.scss")
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
        .pipe(gulp.dest(themePath + "/includes/css"))
        .pipe(browserSync.stream());
}

const watch = function(cb) {
    gulp.watch(themePath + "/includes/sass/*.scss", gulp.series(css));
    gulp.watch('**/*.php').on('change', browserSync.reload);
    gulp.watch('**/*.js').on('change', browserSync.reload);
    cb();
}

exports.default = gulp.series(css, server, watch);