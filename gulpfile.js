'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	electron = require('electron-connect').server.create();

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('./css'));
});

gulp.task('server',function(){
	electron.start();
	gulp.watch(['index.js','./src/**/*.js'], electron.restart);
	gulp.watch('./src/sass/**/*.scss', ['sass']);
	// Reload renderer process
	//gulp.watch(['js/**/*.js', 'index.html', 'css/*.css'], electron.reload);
	gulp.watch(['js/**/*.js', 'index.html', 'css/*.css'], electron.reload);
});
gulp.task('reload:browser', function () {
  // Restart main process
  electron.restart();
});

gulp.task('reload:renderer', function () {
  // Reload renderer process
  electron.reload();
});

gulp.task('default',['server','sass']);
