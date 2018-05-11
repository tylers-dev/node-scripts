'use strict';

var gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('autoprefixer'),
	precss = require('precss'),
	cssnano = require('cssnano'),
	mqpacker = require('css-mqpacker'),
	inlinesvg = require('postcss-inline-svg'),
	dependencies = require('gulp-dependencies'),
	sftp = require('gulp-sftp'),
	browserSync = require('browser-sync').create(),
	rename = require('gulp-rename'),
	gulpif = require('gulp-if'),
	argv = require('yargs').argv,

	/* these are used to split critical styles and write paths */
	split = require('postcss-critical-split'),
	rename = require('gulp-rename'),
	assets = require('postcss-assets')

var env, isMinified, outputDir;
var ftpHost = "", ftpUser, ftpPass, ftpPort, ftpRemote;
var cssGlob = 'src/css/**/[^_]*.css';

//DEPLOYMENT OPTIONS
////////////////////////////////////////////////////////////////////////////////
if ( argv.ftp!=undefined ){
	//FTP output settings
	outputDir = 'output/development/';
	isMinified = false;
	ftpHost = 'lxjanus.hrblock.net';
	ftpUser = 'vignette';
	ftpPass = 'vignette1';
	ftpPort = 22;
	ftpRemote = "/appdata/docroots/https-www.hrblock.com-prod-https-80/docs/hrblock_2013/testing/"+(argv.ftp || "YOUR-FOLDER")+"/css/";
} else if ( argv.prod!=undefined ){
	//Production output settings
	outputDir = 'output/production/';
	isMinified = true;
} else { //default
	//Development output settings
	//outputDir = 'output/development/';
	outputDir = 'C:/MAMP/htdocs/css/split'; //use this for local MAMP testing
	isMinified = true;
}
////////////////////////////////////////////////////////////////////////////////

//CSS PROCESSING
////////////////////////////////////////////////////////////////////////////////
gulp.task('css', ['css:split:critical', 'css:split:rest']);
gulp.task('css:split:critical', function(done){
	var splitOptions = getSplitOptions(true);
	var postProcs = postCssProcessors.slice();
	postProcs.splice(1, 0, split(splitOptions));
	return gulp.src(cssGlob)
		.pipe(gulpif(argv.forceall===undefined, dependencies({
			match  : /@import\s+'(.+)'/g,
			replace: function(f) { 
				var lastSlash = f.lastIndexOf("/")+1;
				return f.slice(0, lastSlash) + "_" + f.slice(lastSlash) + ".css";
			},
			dest   : outputDir,
			ext    : ".css",
			save   : false //let the split:rest handle the dep map creation
		})))
		.pipe(sourcemaps.init())
		.pipe(postcss(postProcs))
		.on('error', done)
		.pipe(sourcemaps.write("."))
		.pipe(rename({ 'suffix': splitOptions.suffix }))
		.on('error', done)
		.pipe(gulp.dest(outputDir))
		.pipe(gulpif(argv.ftp!=undefined, sftp({ host: ftpHost, user: ftpUser, pass: ftpPass, port: ftpPort, remotePath: ftpRemote})))
});
gulp.task('css:split:rest', function(done){
	var splitOptions = getSplitOptions(false);
	var postProcs = postCssProcessors.slice();
	postProcs.splice(1, 0, split(splitOptions));
	return gulp.src(cssGlob)
		.pipe(gulpif(argv.forceall===undefined, dependencies({
			match: /@import[ \t]['"]?([^'"]+)['"]?;/g,
			replace: function(f) { 
				var lastSlash = f.lastIndexOf("/")+1;
				return f.slice(0, lastSlash) + "_" + f.slice(lastSlash) + ".css";
			},
			dest   : outputDir,
			ext    : ".css",
		  })))
		.pipe(sourcemaps.init())
		.pipe(postcss(postProcs))
		.on('error', done)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(outputDir))
		.pipe(browserSync.reload({ stream: true}))
		.pipe(gulpif(argv.ftp!=undefined, sftp({ host: ftpHost, user: ftpUser, pass: ftpPass, port: ftpPort, remotePath: ftpRemote})))
});
var postCssProcessors = [
	precss(),
	//split processor gets inserted here
	inlinesvg(),
	autoprefixer({
		'remove': false, // don't remove any existing/manually added prefixes
		'browsers': [
			'last 2 versions',
			'android 4.4'
		]
	}),
	mqpacker({
		sort: true
	}),
	cssnano({
		'safe': true,
		'core': isMinified,
		'discardComments': isMinified
	})
]
////////////////////////////////////////////////////////////////////////

//GULP TASKS
////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function(){
	gulp.watch("src/css/**/*.css", ['css']);
});
/*
	Run default task by typing "gulp" in Terminal
	Stop watch task by typing Ctrl + C
	Parameters:
	--forceall = force all css to process, rather than just last modified
	--prod = deploy the css to a defined "prod" path
	--ftp = deploy the css to a defined "ftp" path
*/
gulp.task('default', ['css', 'watch'], function(){
	//Proxy serves the localhost instance, follow the local MAMP steps in Confluence to run an instance of dev/prod on your local machine
	browserSync.init({
      proxy: "http://localhost/"
  });
});
////////////////////////////////////////////////////////////////////////

//FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
function getSplitOptions(isCritical) {
	var options = {
		'start':   'critical:start',
		'stop':    'critical:end',
		'blockTag':'critical!',
		'suffix':  '-critical'
	};

	if (isCritical === true) {
		options.output = split.output_types.CRITICAL_CSS;
	} else {
		options.output = split.output_types.REST_CSS;
	}

	return options;
}

//Combine css-parent files with their css-authoring files into a single instance css into the /css folder
var gap = require('gulp-append-prepend');
var replace = require('gulp-replace');
var fs = require("fs");
gulp.task('create-css', function(){
	fs.readdir( "src/css-parent", function( err, files ) {
		files.forEach(file=>{
			//Find all non critical parents
			if(file.indexOf(".css") >= 0 && file.indexOf("-critical.css") === -1){
				var fileName = file.split(".")[0]; //filename without .css extension
				var restImports = getImports(fileName);
				var criticalImports = getImports(fileName, true);
				//Remove variables from critical
				criticalImports = criticalImports.filter((x)=>{ return (x.indexOf("base/variables") === -1)});
				if(!fs.existsSync("src/css-authoring/_"+file)){
					//If file doesn't have an authoring file match, use parent file as is
					var mergedImports = restImports.join("\n");
					if(criticalImports.length>0){
						mergedImports += "\n\n/* critical:start */\n";
						mergedImports += criticalImports.join("\n");
						mergedImports += "\n/* critical:end */";
					}
					fs.writeFileSync("src/css/"+file, mergedImports, 'utf8');
				}
				gulp.src("src/css-authoring/_"+file)
					.pipe(gap.prependText(restImports))
					.pipe(gulpif(criticalImports.length>0, replace(/^\/\* critical:start.*/m, function(match) {
						// Add in critical imports
						criticalImports.unshift(match);
						return criticalImports.join("\n");
					})))
					.pipe(rename(file))
					.pipe(gulp.dest("src/css"));
			}
		})
	})
});
function getImports(fileName, critical=false){
	try{
		var ext = critical ? "-critical.css" : ".css";
		var contents = fs.readFileSync("src/css-parent/"+fileName+ext, 'utf8');
		if(contents === null) return null;
		var imprts = contents.match(/^@import.*/gm);
		//Clean up imports
		imprts = imprts.filter((imprt)=>{return imprt.indexOf("css-split/"+fileName.split(".")[0]) === -1}).map(imprt=>{
			return imprt.replace("../css-split/","");
		})
		return imprts;
	}catch(err){
		return [];
	}
}