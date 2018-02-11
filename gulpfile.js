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
		.pipe(rename(function (path){
			path.basename = (path.basename.replace(/[^A-Z0-9]+/ig, "_")).toLowerCase();
			path.extname = path.extname.toLowerCase();
		}))
		.pipe(gulp.dest(config.build.images));
});

// Minify JS
gulp.task('minifyJS', function(){
	return gulp.src(config.src.js)
		.pipe(sourcemaps.init())
			.pipe(uglify()).on('error', function(err){
				console.log(err.toString());
				this.emit('end');
			})
			.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		// .pipe(gulp.dest(config.build.js));
		.pipe(gulp.dest(function(file){
			return file.base;
		}));
});

// Add vendor prefixes to CSS and minify it
gulp.task('css', function(){
	return gulp.src(config.src.css)
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cleanCSS({debug: true}))
		.pipe(rename({suffix: '.min'}))
		// .pipe(gulp.dest(config.build.css))
		.pipe(gulp.dest(function(file){
			return file.base;
		}))
		.pipe(browserSync.stream());
});

// Compile SASS to CSS and add prefixes
gulp.task('sass', function(){
	return gulp.src(config.src.sass)
		.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(autoprefixer({ cascade: false }))
		.pipe(sourcemaps.write('.'))
		// .pipe(gulp.dest(config.build.css))
		.pipe(gulp.dest(function(file){
			return file.base;
		}))
		.pipe(browserSync.stream());
});


// Default task
// gulp.task('default', ['minifyJS', 'sass'], function(){
gulp.task('default', ['sass'], function(){
	gulp.start('server');
	gulp.watch(config.src.path).on('change', browserSync.reload);
	gulp.watch(config.src.sass, ['sass']);
	gulp.watch(config.src.js).on('change', browserSync.reload);
	// gulp.watch(config.src.js, ['minifyJS', browserSync.reload]);
});

gulp.task('php', function(){
	lang = 'PHP';
	gulp.start('default');
});

gulp.task('wordpress', function(){
	lang = 'wordpress';
	gulp.start('default');
});

// Compile SASS and minify JS for distribution on same folder
gulp.task('dist', ['sass', 'minifyJS']);

// Copy files from source to build folder, compile SASS and minify JS
gulp.task('dist-copy', ['files', 'images', 'sass', 'minifyJS']);