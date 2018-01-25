let lang = 'HTML';

const config = require('./config.json');

const gulp = require('gulp');
const browserSync = require('browser-sync');
const php = require('gulp-connect-php');

// JS related plugins
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// CSS & SASS related plugins
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');


// Start browserSync server for HTML
gulp.task('server', function(){
	if (lang == 'HTML'){
		browserSync.create();
		browserSync.init({
			server: {
				baseDir: config.build.path
			}
		});
	} else if (lang == 'PHP') {
		php.server({
			base: config.build.path,
			port: 3000
		}, function(){
			browserSync({
				proxy: 'localhost:3000'
			});
		});
	} else if (lang == 'wordpress') {
		browserSync.init({
			proxy: config.wp_proxy
		});
	}
});

// Copy HTML and PHP files
gulp.task('files', function(){
	return gulp.src(config.src.path)
		.pipe(gulp.dest(config.build.path));
});

// Copy IMG files
gulp.task('images', function(){
	return gulp.src(config.src.images)
		.pipe(gulp.dest(config.src.images));
});

// Minify JS
gulp.task('minifyJS', function(){
	return gulp.src(config.src.js)
		.pipe(uglify())
		.pipe(rename({suffix: '.min' }))
		.pipe(gulp.dest(config.build.js));
});

// Add vendor prefixes to CSS and minify it
gulp.task('css', function(){
	return gulp.src(config.src.css)
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cleanCSS({debug: true}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.build.css))
		.pipe(browserSync.stream());
});

// Compile SASS to CSS and add prefixes
gulp.task('sass', function(){
	return gulp.src(config.src.sass)
		.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(autoprefixer({ cascade: false }))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest(config.build.css))
		.pipe(browserSync.stream());
});

// Copy files from source to build folder
gulp.task('dist', ['files', 'css', 'js', 'images']);


// Default task
gulp.task('default', ['minifyJS', 'sass'], function(){
	gulp.start('server');
	gulp.watch(config.src.path).on('change', browserSync.reload);
	gulp.watch(config.src.css, ['sass']);
	gulp.watch(config.src.js, ['minifyJS', browserSync.reload]);
});

gulp.task('php', function(){
	lang = 'PHP';
	gulp.start('default');
});

gulp.task('wordpress', function(){
	lang = 'wordpress';
	gulp.start('default');
});