'use strict';

// START Editing Project Variables.
// Project related.
var project                 = 'WPGulpTheme'; // Project Name.
var projectURL              = 'http://localhost:8042';

var styleSRC                = './public/scss/style.scss'; // Path to main .scss file.
var styleDestination        = './public/css/'; // Path to place the compiled CSS file.

// JS Vendor related.
// var jsVendorSRC             = './public/js/vendor/*.js'; // Path to JS vendor folder.
// // var jsVendorDestination     = './public/js/'; // Path to place the compiled JS vendors file.
var jsCustomSRC             = './*.js'; // Path to JS custom scripts folder.
// var jsCustomDestination     = './assets/js/'; // Path to place the compiled JS custom scripts file.
// var jsCustomFile            = 'custom'; // Compiled JS custom file name.
// Images related.
var imagesSRC               = './assets/img/raw/**/*.{png,jpg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination       = './assets/img/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Watch files paths.
// var styleWatchFiles         = '/var/www/html/cerberus/wp-content/themes/deep_child_theme/assets/css/**/*.scss'; // Path to all *.scss files inside css folder and inside them.
var styleWatchFiles         = './public/scss/**/*.scss'; // Path to all *.scss files inside css folder and inside them.
// var vendorJSWatchFiles      = './assets/js/vendor/*.js'; // Path to all vendor JS files.
// var customJSWatchFiles      = './assets/js/custom/*.js'; // Path to all custom JS files.
// var projectPHPWatchFiles    = './**/*.php'; // Path to all PHP files.
// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

// STOP Editing Project Variables.

var gulp = require('gulp');
// var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

// CSS related plugins.
var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
var sassLint     = require('gulp-sass-lint');
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var mmq          = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.

// JS related plugins.
var concat       = require('gulp-concat'); // Concatenates JS files
var uglify       = require('gulp-uglify'); // Minifies JS files
var jshint       = require('gulp-jshint');

// Image realted plugins.
var imagemin     = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec       = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter       = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify       = require('gulp-notify'); // Sends message notification to you
var browserSync  = require('browser-sync'); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var compass      = require('compass-importer');


gulp.task( 'default', ['styles', 'browser-sync'], function () {
    // gulp.watch( projectPHPWatchFiles, reload ); // Reload on PHP file changes.
    gulp.watch( styleWatchFiles, [ 'styles' ] ); // Reload on SCSS file changes.
    // gulp.watch( vendorJSWatchFiles, [ 'vendorsJs', reload ] ); // Reload on vendorsJs file changes.
    // gulp.watch( customJSWatchFiles, [ 'customJS', reload ] ); // Reload on customJS file changes.
});

// gulp.task('browser-sync', ['nodemon'], function() {
// 	browserSync.init(null, {
// 		proxy: "http://localhost:8042",
//         files: ["public/**/*.*"],
//         browser: "google chrome",
//         port: 7000,
// 	});
// });

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from openning automatically
 */
gulp.task( 'browser-sync', ['nodemon'], function() {
    browserSync.init( {
  
      // For more options
      // @link http://www.browsersync.io/docs/options/
  
      // Project URL.
      proxy: projectURL,
  
      // `true` Automatically open the browser with BrowserSync live server.
      // `false` Stop the browser from automatically opening.
      open: true,
  
      // Inject CSS changes.
      // Commnet it to reload browser for every CSS change.
      injectChanges: true,
  
      // Use a specific port (instead of the one auto-detected by Browsersync).
      port: 7000,

      browser: "google chrome",
  
    } );
  });

/*
* Sass Lint
* https://github.com/sasstools/sass-lint/tree/master/docs/rules
*/
gulp.task('lint', function () {
    return gulp.src(styleWatchFiles)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
  });

  /**
   * Task: `styles`.
   *
   * Compiles Sass, Autoprefixes it and Minifies CSS.
   *
   * This task does the following:
   *    1. Gets the source scss file
   *    2. Compiles Sass to CSS
   *    3. Writes Sourcemaps for it
   *    4. Autoprefixes it and generates style.css
   *    5. Renames the CSS file with suffix .min.css
   *    6. Minifies the CSS file and generates style.min.css
   *    7. Injects CSS or reloads the browser via browserSync
   */
   gulp.task('styles', ['lint'], function () {
      gulp.src( styleSRC )
      .pipe( sourcemaps.init() )
      .pipe( sass( {
        errLogToConsole: true,
        outputStyle: 'compact',
        importer: compass,
        // outputStyle: 'compressed',
        // outputStyle: 'nested',
        // outputStyle: 'expanded',
        includePaths: ['./node_modules/breakpoint-sass/stylesheets'],
        precision: 10
      } ) )
      .on('error', console.error.bind(console))
      .pipe( sourcemaps.init( { loadMaps: true } ) )
      .pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
  
      .pipe( sourcemaps.write ( './' ) )
      .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
      .pipe( gulp.dest( styleDestination ) )
  
      .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
      .pipe( mmq( { log: true } ) ) // Merge Media Queries only for .min.css version.
  
      .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.
  
      .pipe( rename( { suffix: '.min' } ) )
      .pipe( minifycss( {
        maxLineLen: 10
      }))
      .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
      .pipe( gulp.dest( styleDestination ) )
  
      .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
      .pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
      .pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
   });

   gulp.task('jshint', function() {
    gulp.src(jsCustomSRC)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });

gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});