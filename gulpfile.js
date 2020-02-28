const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

let dir = {
	src: {
		html: './app/*.html',
		style: './app/sass/**/*.sass',
		js: './app/js/**/*.js',
		img: './app/img/**/*'
	},
	dest: {
		//html: './app/*.html',
		style: './app/css',
		js: './app/scripts',
		img: './app/images'
	},
	watch: {
		html: './app/*.html',
		style: './app/sass/**/*.sass',
		js: './app/js/**/*.js',
		img: './app/img/**/*'
	}
};


gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: "app"
		}
	});
});


gulp.task('build:html', function() {
	return gulp.src(dir.src.html)
	.pipe(browserSync.reload({stream: true}))
});


gulp.task('build:sass', function() {
	return gulp.src(dir.src.style)
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(concat('style.min.css'))
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 2 versions'],
		grid: true
}))
	.pipe(cleanCSS({
		level: 2
	}))
	.pipe(gulp.dest(dir.dest.style))
	.pipe(browserSync.stream())
});


gulp.task('build:js', function() {
	return gulp.src([
		'./app/libs/**/*.js',
		'./app/js/*.js'
	])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify({
		toplevel: true
	}))
	.pipe(gulp.dest(dir.dest.js))
	.pipe(browserSync.stream())
});


gulp.task('build:img', function() {
	return gulp.src(dir.src.img)
	.pipe(imagemin({
		progressive: true
	}))
	.pipe(gulp.dest(dir.dest.images))
});




gulp.task('watch', function() {
	gulp.watch(dir.watch.html, gulp.parallel('build:html'));
	gulp.watch(dir.watch.style, gulp.parallel('build:sass'));
	gulp.watch(dir.watch.js, gulp.parallel('build:js'));
});

gulp.task('default', gulp.parallel('build:js', 'build:sass', 'build:html', 'browserSync', 'watch'));


