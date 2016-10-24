const gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	plumber=require('gulp-plumber'),//检测错误
	cache = require('gulp-cache'),//图片压缩缓存
	pngquant = require('imagemin-pngquant'),//图片深入压缩
	imageminJpegtran = require('imagemin-jpegtran'),
	imageminGifsicle = require('imagemin-gifsicle'),
	imageminOptipng = require('imagemin-optipng');
function errrHandler( e ){
    // 控制台发声,错误时beep一下
    gutil.beep();
    gutil.log(e);
    this.emit('end');
}
gulp.task('imagemin', function () {
    gulp.src('./**/*.{png,jpg,gif,ico}')
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(cache(imagemin({     
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片          
            use: [pngquant(),imageminJpegtran({progressive: true})
            , imageminGifsicle({interlaced: true}),imageminOptipng({optimizationLevel:3})] //使用pngquant深度压缩png图片的imagemin插件          
        })))
        .pipe(gulp.dest('min'));
});
