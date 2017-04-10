var gulp = require('gulp');

// CSS related plugins
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var sass = require('gulp-sass');
// JS related plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
// Utility related plugins
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var opt = {
	src: 'src/',
	dest: 'dist/'
}

// Start browserSync server
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
	});
});

// Copy HTML files
gulp.task('html', function() {
	return gulp.src(opt.src + '**/*.html')
		.pipe(gulp.dest(opt.dest));
});

// Converts SASS to CSS with gulp-sass
gulp.task('styles', function (){
	return gulp.src(opt.src + 'sass/**/*.scss')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer({ cascade: false })) // Autoprefixer
		.pipe(gulp.dest(opt.dest + 'css/'))
		.pipe(rename({suffix: '.min'})) // Copy file
		.pipe(cleancss()) // Minify CSS
		.pipe(gulp.dest(opt.dest + 'css/'))
		.pipe(browserSync.stream());
});

// Concatenate scripts and minify them into one output file
gulp.task('scripts', function(){
	return gulp.src(['src/js/plugins/*.js', 'src/js/main.js'])
		.pipe(concat('main.js'))
		.pipe(jshint())
		.pipe(jshint.reporter('fail'))
		.pipe(gulp.dest(opt.dest + 'js/'))
		.pipe(rename({suffix: '.min'})) // Copy file
		.pipe(uglify()) // Minify JS
		.pipe(gulp.dest(opt.dest + 'js/'));
});

gulp.task('default', ['html', 'styles', 'scripts', 'browserSync'], function(){
	gulp.watch('src/sass/*.scss', ['styles']);
	gulp.watch('src/*.html', ['html', browserSync.reload]);
	gulp.watch('src/js/*.js', ['scripts', browserSync.reload]);
});