let
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	fileinclude = require('gulp-file-include'),
	del = require('del');



//таск клин
gulp.task('clean', async function(){
	del.sync('dist')
})


//таск scss
gulp.task('scss', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer({
			overRideBrowserslist: ['last 10 versions'],
			}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});
//таск css
gulp.task('css', function(){
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/slick-carousel/slick/slick.css',
	])
		.pipe(concat('_libs.scss'))
		.pipe(gulp.dest('app/scss'))
		.pipe(browserSync.reload({stream: true}))
});
//таск html
gulp.task('html', function(){
	return gulp.src('app/html/[^_]*.html')
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(concat('index.html'))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream: true}))
});
// таск на скрипт
gulp.task('script', function(){
	return gulp.src('app/js/*.js')
	.pipe(browserSync.reload({stream: true}))
});
//таск на js
gulp.task('js', function(){
	return gulp.src([
		'node_modules/slick-carousel/slick/slick.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({stream: true}))
});
// таск на браузер
gulp.task('browser-sync', function() {
	browserSync.init({
			server: {
					baseDir: "app/"
			}
	});
});
//таск на билд
gulp.task('export', function(){
	let buildHtml = gulp.src('app/**/[^_]*.html')
		.pipe(gulp.dest('dist'));

	let BuildCss = gulp.src('app/css/**/*.css')
		.pipe(gulp.dest('dist/css'));

	let BuildJs = gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js'));

	let BuildFonts = gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'));

	let BuildImg = gulp.src('app/img/**/*.*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function(){
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
	gulp.watch('app/html/**/*.html', gulp.parallel('html'))
	gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'export'))

gulp.task('default', gulp.parallel('css' ,'scss', 'js', 'browser-sync', 'html', 'watch'));