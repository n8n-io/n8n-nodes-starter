const { task, src, dest } = require('gulp');

task('build:icons', copyIcons);

function copyIcons() {
	src('nodes/**/*.{png,svg}').pipe(dest('dist/nodes'));

	return src('credentials/**/*.{png,svg}').pipe(dest('dist/credentials'));
}

// TODO: Add i18n to pipeline
