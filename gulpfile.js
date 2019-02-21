const gulp = require('gulp');
const {
    series
} = require('gulp');
const sass = require('gulp-sass'); //https://www.npmjs.com/package/gulp-sass
sass.compiler = require('node-sass');
const minify = require('gulp-minify'); //https://www.npmjs.com/package/gulp-minify
const eslint = require('gulp-eslint'); //https://www.npmjs.com/package/gulp-eslint
const babel = require('gulp-babel'); //https://www.npmjs.com/package/gulp-babel
const rename = require('gulp-rename'); //https://www.npmjs.com/package/gulp-rename
//const concat = require('gulp-concat'); //to combine multiple files into one


async function scss(cb) {
    //create the css from the sass files
    await gulp.src('sass/tinyshell.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
    cb();
};

async function lint(cb) {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    await gulp.src(['js/tinyshell.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
    cb();
};

async function bbl(cb) {
    await gulp.src('js/tinyshell.js')
        .pipe(babel({
            plugins: ["@babel/plugin-proposal-class-properties"]
        }))
        .pipe(minify({
            compress: true,
            preserveComments: 'some',
            noSource: true,
            mangle: false
        }))
        .pipe(gulp.dest('dist/js'));
    cb();
};

async function fonts(cb) {
    //copy the fonts to the dist/css/ folder
    await gulp.src('fonts/**')
        .pipe(gulp.dest('dist/fonts/'));

    cb();
}

exports.lint = lint;
exports.fonts = series(fonts);
exports.scss = series(scss);
exports.build = series(bbl);

// gulp.src('js/min/tinyshell.min.js')
//     .pipe(gulp.dest('dist/js/'));
// ext: {
//     min: '.min.js'
// },

//copy the transpiled js to the demo folder
//minify the es5 js file then copy to the dist/js/ folder
// await gulp.src('js/tinyshell.es5.js')
//     .pipe(minify({
//         compress: true,
//         preserveComments: 'some',
//         noSource: true
//     }))
//     .pipe(gulp.dest('dist/tinyshell.min.js'));

//copy the css to the dist folder with the .min added to the name
// gulp.src("./css/tinyshell.css")
//     .pipe(rename(function (path) {
//         path.basename += ".min";
//     }))
//     .pipe(gulp.dest("./dist/css/"));

//convert the expanded version of the sass to the css folder with all the comments not compressed
// await sass('sass/tinyshell.scss', {
//         style: 'expanded'
//     })
//     .pipe(gulp.dest('css/'));