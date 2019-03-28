const gulp = require("gulp")
const typescript = require("gulp-typescript")
const clean = require("gulp-clean")

const outDir = "dist/"

gulp.task("clean", function () {
  return gulp
    .src(outDir, {
      read: false,
      allowEmpty: true
    })
    .pipe(clean())
})

gulp.task("typescript", function () {
  return gulp
    .src("*.ts")
    .pipe(typescript())
    .pipe(gulp.dest(outDir))
})

gulp.task("default", gulp.series("clean", "typescript"))