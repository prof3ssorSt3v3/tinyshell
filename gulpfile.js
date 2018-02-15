var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
//https://www.npmjs.com/package/gulp-ruby-sass
var minify = require('gulp-minify');
//https://www.npmjs.com/package/gulp-minify
var rename = require('gulp-rename');
//https://www.npmjs.com/package/gulp-rename
 
gulp.task('sass', () => {
    //create the css from the sass files
    sass('sass/tinyshell.scss', {
        style: 'compressed'
        })
        .pipe(gulp.dest('css/'));
    
    //copy the css to the dist folder with the .min added to the name
    gulp.src("./css/tinyshell.css")
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("./dist/css/")); 
    
    //copy the css to the demo folder with all the comments not compressed
    sass('sass/tinyshell.scss', {
        style: 'compact'
        })
        .pipe(gulp.dest('demo/'));
});

gulp.task('copy', ()=>{
    //copy the standard js to the demo folder
    gulp.src( 'js/tinyshell.js' )
        .pipe(gulp.dest( 'demo/' ));
    
    //minify inside js folder then copy to the dist/js/ folder
    gulp.src('js/tinyshell.js')
        .pipe(minify({
            compress: true,
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('js/'));
    
    gulp.src( 'js/tinyshell.min.js' )
        .pipe(gulp.dest( 'dist/js/' ));
    
    //copy the fonts to the dist/css/ folder
    gulp.src( 'css/fonts/**')
        .pipe(gulp.dest('dist/css/fonts/'))
})