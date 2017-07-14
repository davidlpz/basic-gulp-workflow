var gulp = require('gulp');

// CSS related plugins
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// JS related plugins
var uglify = require('gulp-uglify');
// Utility related plugins
var rename = require('gulp-rename');
// Server related plugins
var browserSync = require('browser-sync').create();
// var browserSync = require('browser-sync');
// var php = require('gulp-connect-php');

var opt = {
	src: 'html/',
	dest: 'html/',
	minDest: 'min/',
	suffixMin: '.min'
}

// Start browserSync server
gulp.task('syncHTML', function(){
	browserSync.init({
		server: {
			baseDir: opt.dest
		}
	});
});

gulp.task('syncPHP', function(){
	php.server({
		base: opt.dest,
		port: 3000
	}, function(){
		browserSync({
			proxy: 'localhost:3000'
		});
	});
});

// Copy HTML files
gulp.task('html', function(){
	return gulp.src(opt.src + '**/*.html')
		.pipe(gulp.dest(opt.dest));
});

// Copy JS files
gulp.task('js', function(){
	return gulp.src(opt.src + 'js/**/*')
		.pipe(gulp.dest(opt.dest + 'js/'));
});

// Copy IMG files
gulp.task('images', function(){
	return gulp.src(opt.src + 'img/**/*')
		.pipe(gulp.dest(opt.dest + 'img/'));
});

// Minify JS
gulp.task('minifyJS', function(){
	var src = opt.src + 'js/**'
	return gulp.src([src + '/*.js', '!' + opt.src + '**/*min.js'])
		.pipe(uglify())
		.pipe(rename({suffix: opt.suffixMin }))
		.pipe(gulp.dest(opt.dest + 'js/' + opt.minDest));
});

// Add vendor prefixes to CSS and minify it
gulp.task('css', function(){
	var src = opt.src + 'css/**'
	return gulp.src([src + '/*.css', '!' + src + '/*.min.css'])
		.pipe(autoprefixer({ cascade: false })) // Autoprefixer
		.pipe(gulp.dest(opt.dest + 'css/'))
		.pipe(cleanCSS({debug: true})) // Minify file
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(opt.dest + 'css/'))
		.pipe(browserSync.stream()); // Inject min.css
});

// Compile SASS to CSS, add prefixes and minify it
gulp.task('sass', function(){
	var src = opt.src + 'css/**'
	return gulp.src(src + '/*.+(scss|sass)')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer({ cascade: false })) // Autoprefixer
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest(opt.dest + 'css/'))
		.pipe(cleanCSS({debug: true})) // Minify file
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(opt.dest + 'css/'))
		.pipe(browserSync.stream()); // Inject min.css
});


// Default task
gulp.task('default', ['sass', 'minifyJS'], function(){
	gulp.start('syncHTML');
	gulp.watch(opt.src + '**/*.html').on('change', browserSync.reload);
	gulp.watch([opt.src + 'css/**/*.+(scss|sass)', '!' + opt.src + 'css/**/*.min.css'], ['sass']);
	gulp.watch([opt.src + 'js/**/*.js', '!' + opt.src + 'js/**/*min.js'], ['minifyJS', browserSync.reload]);
});

// Default task
gulp.task('default-php', ['sass', 'minifyJS'], function(){
	gulp.start('syncPHP');
	gulp.watch(opt.src + '**/*.php').on('change', browserSync.reload);
	gulp.watch([opt.src + 'css/**/*.+(scss|sass)', '!' + opt.src + 'css/**/*.min.css'], ['sass']);
	gulp.watch([opt.src + 'js/**/*.js', '!' + opt.src + 'js/**/*min.js'], ['minifyJS', browserSync.reload]);
});

// Copy files from source to destination + Watch for changes
// gulp.task('copy', ['html', 'css', 'js', 'minifyJS', 'images'], function(){
// 	gulp.start('syncHTML');
// 	gulp.watch(opt.src + '**/*.html', ['html', browserSync.reload]);
// 	gulp.watch(opt.src + 'img/**/*', ['images']);
// 	gulp.watch([opt.src + 'css/**/*.css', '!' + opt.src + 'css/**/*.min.css'], ['css']);
// 	gulp.watch(opt.src + 'js/*.js', ['js', 'minifyJS', browserSync.reload]);
// });