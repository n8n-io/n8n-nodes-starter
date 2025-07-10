const { task, src, dest } = require('gulp');

task('build:icons', function () {
  return src(['nodes/**/*.png', 'nodes/**/*.svg'], { base: 'nodes' })
    .pipe(dest('dist/nodes'));
});
