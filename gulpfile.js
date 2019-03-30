const gulp = require("gulp")
const typescript = require("gulp-typescript")
const clean = require("gulp-clean")

const srcDir = "src/"
const outDir = "dist/"

gulp.task("clean", function() {
  return gulp
    .src(outDir, {
      allowEmpty: true,
      read: false,
    })
    .pipe(clean())
})

gulp.task("typescript", function() {
  return gulp
    .src(`${srcDir}/**/*.ts`)
    .pipe(typescript())
    .pipe(gulp.dest(outDir))
})

gulp.task("default", gulp.series("clean", "typescript"))
