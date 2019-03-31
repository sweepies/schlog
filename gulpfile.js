const gulp = require("gulp");
const typescript = require("gulp-typescript").createProject("tsconfig.json");
const clean = require("gulp-clean");

const srcDir = "src/";
const outDir = "dist/";

gulp.task("clean", function() {
  return gulp
    .src(outDir, {
      allowEmpty: true,
      read: false,
    })
    .pipe(clean());
});

gulp.task("compile", function() {
  return gulp
    .src(`${srcDir}/**/*.{ts,js}`)
    .pipe(typescript())
    .pipe(gulp.dest(outDir));
});

gulp.task("default", gulp.series("clean", "compile"));
