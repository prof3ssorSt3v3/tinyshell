const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
//https://www.npmjs.com/package/gulp-ruby-sass
const minify = require('gulp-minify');
//https://www.npmjs.com/package/gulp-minify
const rename = require('gulp-rename');
//https://www.npmjs.com/package/gulp-rename
const eslint = require('gulp-eslint');
//https://www.npmjs.com/package/gulp-eslint
const babel = require('gulp-babel');
//https://www.npmjs.com/package/gulp-babel
const concat = require('gulp-concat');
//to combine multiple files into one
 
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
        style: 'expanded'
        })
        .pipe(gulp.dest('demo/'));
});

gulp.task('lint', ()=>{
   // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['js/tinyshell.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError()); 
});

//transpile and copy tinyshell to js/es5/ folder
gulp.task('babel', ()=>{
   gulp.src('js/tinyshell.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('js/es5/')) 
});

gulp.task('copy', ()=>{
    //copy the transpiled js to the demo folder
    gulp.src( 'js/es5/tinyshell.js' )
        .pipe(gulp.dest( 'demo/' ));
    
    //minify the es5 js file then copy to the dist/js/ folder
    gulp.src('js/es5/tinyshell.js')
        .pipe(minify({
            compress: true,
            ext: {
                min: '.min.js'
            },
            preserveComments: 'some',
            noSource: true
        }))
        .pipe(gulp.dest('js/min/'));
    
    gulp.src( 'js/min/tinyshell.min.js' )
        .pipe(gulp.dest( 'dist/js/' ));
    
    //copy the fonts to the dist/css/ folder
    gulp.src( 'css/fonts/**')
        .pipe(gulp.dest('dist/css/fonts/'))
})