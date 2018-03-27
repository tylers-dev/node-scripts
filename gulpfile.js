//Dependencies
var gulp = require('gulp'),
    _ = require('lodash'),
    fileinclude = require('gulp-file-include'),
    changed = require('gulp-changed'),
    chmod = require('gulp-chmod'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    rename = require("gulp-rename"),
    zip = require('gulp-zip'),
    merge = require('merge-stream'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    tinypng = require('gulp-tinypng'),
    file = require('gulp-file'),
    fs = require('fs'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    //webshot = require('webshot'),
    stringify = require('csv-stringify'),
    ftp = require( 'vinyl-ftp' ),
    gutil = require('gulp-util'),
    prompt = require('prompt');
    prettify = require('gulp-jsbeautifier');
//Configuration
var configPATH = "./config.js";
var config, slides, shared_resource;
setConfig();
function setConfig(){
  try{
    config = require(configPATH).config;
    slides = _.flatMap(config["CLM_PRESENTATIONS"], "SLIDES");
  }catch(e){
    console.log("No config.js found")
  }
};

// gulp.task('testTask', function() {
//   var test = {
//     "test":"123",
//     "test2":"456",
//   }
//   return file('test.js', JSON.stringify(test), { src: true })
//       .pipe(beautify({indent_size: 2}))
//       .pipe(gulp.dest(''));
// });

//CONFIG.JS/////////////////////////////////////////////////////////////////////////////////////////
gulp.task('getConfig', function(cb) {
  delete require.cache[require.resolve(configPATH)];
  setConfig();
  runSequence(['shared-assets', 'build-html'], cb);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//HTML/////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('build-html', function() {
  var streamAry = [];
  slides.forEach(slide => {
    var slideName = slide.name;
    if(slide.csv && slide.csv["slide.filename"]){
      slide.keymessage = slide.csv["slide.filename"];
    }else{
      slide.keymessage = slide.name+".zip";
    }
    slide.presentation = _.find(config.CLM_PRESENTATIONS, function(clm) {
      return _.find(clm.SLIDES, slide);
    }).id;
    streamAry.push(gulp.src(['src/views/'+slideName+'/*.html'], {base:"src/views"})
      .pipe(plumber())
      .pipe(fileinclude({
          prefix: '@@',
          basepath: './src/views/',
          context: slide
      }))
      .pipe(rename(slideName+"/index.html"))
    )
  });
  return merge(streamAry)
    .pipe(plumber())
    //.pipe(changed('bin'))
    .pipe(chmod(0o755))
    .pipe(gulp.dest('bin'))
    .pipe(browserSync.stream());
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//STYLES ASSETS///////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('styles', function () {
  var sharedStyles = gulp.src(['src/shared/styles/*.{scss,css}'], {base:"src"})
  var tileStyles = gulp.src(['src/views/**/*.{scss,css}'], {base:"src/views"})
  return merge(sharedStyles, tileStyles)
    .pipe(plumber())
    .pipe(changed('bin'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['src/shared/styles']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(chmod(0o755))
    .pipe(gulp.dest('bin'))
    .pipe(browserSync.stream());
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//IMAGES COMPRESSION//////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('images:compress', function(cb){
  return gulp.src('src/**/*.+(png|jpg|jpeg)')
    .pipe(tinypng('4bABnpIOYB9vueLJHX3H0qFc0GXJReOr')) //limited number of free compressions, please use after entire project is complete
    .pipe(gulp.dest('src'));
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//GENERATE THUMBNAILS//////////////////////////////////////////////////////////////////////////////////////////////////////
// gulp.task('thumbnails', function(cb){
//   var allTiles = tileData.tiles.slice();
//   var cnt = 0;
//   (function screenshot(){
//     webshot('http://localhost:3000/HumiraDermMosaic2016-22-GSF/index.html', 'thumbnails/'+allTiles[cnt].srcDir+'/thumb.png', {
//       siteType:'file',
//       windowSize: {
//         width:1024,
//         height:768
//       },
//       shotSize: {
//         width: 1024,
//         height: 768
//       },
//       renderDelay:500,
//       userAgent: 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10'
//     }, function(err) {
//        gutil.log("Screenshot Complete for:",allTiles[cnt].title)
//       if(cnt!=allTiles.length){
//         cnt++;
//         screenshot();
//       }
//     });
//   })();
// })
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//CACHE BUST//////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('cache-bust', function(cb){
  //Cache busting href, src, and urls for images, js, and css references
  return gulp.src(['bin/**/*.html', 'bin/**/*.css'])
    .pipe(replace(/(?:href|src|url\s?\()=?['"]?.*?(['"]|\))/g, function(str){
      try{
        var match = str.match(/(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.js|\.css)/g);
        if(match && match[0].length>0){
          match = str.indexOf(match[0])+match[0].length;
          return (str.slice(0, match) + "?cachebuster=" + new Date().getTime() + str.slice(match));
        }else{
          return str;
        }
      }catch(e){}
    }))
    .pipe(gulp.dest('bin'));
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SHARED ASSETS//////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('shared-assets', function(){
  var configStream = gulp.src(configPATH)
    .pipe(plumber())
    .pipe(changed('bin'))
    .pipe(chmod(0o755))
    .pipe(gulp.dest('bin/shared'));
  var sharedStream = gulp.src(['src/shared/**/*', '!src/shared/**/*.scss'], { base: "src" })
    .pipe(plumber())
    .pipe(changed('bin'))
    .pipe(chmod(0o755))
    .pipe(gulp.dest('bin'))
    .pipe(browserSync.stream());
  return merge(configStream,sharedStream);
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TILE ASSETS//////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('tile-assets', function(){
    return gulp.src(['src/views/**/*', '!src/views/_includes', '!src/views/**/*.{html,css,scss}'], { base: "src/views" })
      .pipe(plumber())
      .pipe(changed('bin'))
      .pipe(chmod(0o755))
      .pipe(gulp.dest('bin'))
      .pipe(browserSync.stream());
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//BROWSERSYNC//////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
          baseDir: "bin",
          startPath: "/views",
          directory: true
        }
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//DEPLOY/PACKAGING///////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('zip-deploy', function(){
  var streamAry = [];
  var zips = slides.slice();
  //Remove the 'excluded' slides
  zips = _.filter(zips, function(o) { return o["excluded"]===undefined || o["excluded"]==="false" });
  //All slides
  zips.forEach(tile => {
    var zipName = tile.zipName || tile.name;
    streamAry.push(gulp.src('bin/'+tile.name+'/**/*', { base: "bin/"+tile.name })
      .pipe(zip("zip/" + zipName + '.zip'))
      .pipe(file("ctl/" + zipName +'.ctl', ctlString(zipName+".zip", tile)))
      .pipe(gulp.dest('deploy')));
  });
  return merge(streamAry);
});

// var dateStamp = getDateStamp();
// function getDateStamp(){
//   var d = new Date;
//   return ([d.getMonth()+1, d.getDate(), d.getFullYear()].join('-') + " " + [d.getHours(), d.getMinutes(), d.getSeconds()].join('.'));
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FTP UPLOAD///////////////////////////////////////////////////////////////////////////////////////////////
//Uploads to the Intouch Veeva Dev sandbox 'partner3'
var uploadGlob = [];
var conn = ftp.create( {
    host:     'vf13.vod309.com',
    user:     'cloader@veeva.partner3.intouch',
    password: 'Intouch12345',
    log:      gutil.log
} );
gulp.task('ftp-zip-upload', function(){
  var glob = uploadGlob.map(g => {return "./deploy/zip/"+g+".zip"}) || [];
  return gulp.src(glob)
    .pipe(plumber())
    .pipe(conn.dest('/'))
    .on('error', function(err) {})
    .on('end', function() {});
});
gulp.task('ftp-ctl-upload', function(){
  var glob = uploadGlob.map(g => {return "./deploy/ctl/"+g+".ctl"}) || [];
  return gulp.src(glob)
    .pipe(plumber())
    .pipe(conn.dest('/ctlfile'))
    .on('error', function(err) {})
    .on('end', function() {});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//CLEAN FUNCTIONS/////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('clean:bin', function(){ return del('bin') });
gulp.task('clean:deploy', function(){ return del('deploy') });
gulp.task('clean:src', function(){ return del('src') });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//WATCH////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function(){
  //Configuration (config.js)
  gulp.watch(configPATH, ['getConfig']);
  //Html
  gulp.watch('src/views/**/*.html', ['build-html']);
  //Styles
  gulp.watch('src/**/*.scss', ['styles']);
  //Shared assets
  gulp.watch(['src/shared/**/*', '!src/views/**/*.html'], ['shared-assets']);
  //Tile assets
  gulp.watch(['src/views/**/*', '!src/views/**/*.html'], ['tile-assets']);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TASKS////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('build', ['clean:bin'], function(cb){
  runSequence(['build-html', 'shared-assets', 'tile-assets', 'styles'], 'cache-bust', function(){
    gutil.log(gutil.colors.green("Build Complete. See ./bin folder"));
    cb();
  });
});
gulp.task('default', function(cb){
  runSequence('build', 'watch', 'browser-sync', 'help', cb);
});
gulp.task('upload', ['zip-deploy'], function(cb){
  var slidesToUpload = (gutil.env.slides!=undefined ? String(gutil.env.slides).split(",") : []);
  uploadGlob = slides.filter(slide => {
    if(slide.excluded === "true") return false; //don't add excluded slides
    if(slidesToUpload.length === 0) return true; //adds every slide if specific slides aren't given
    return slidesToUpload.indexOf(String(slide.id)) >= 0 || slidesToUpload.indexOf(String(slide.name)) >= 0; //add any tile that the given array of slides matches in 'name' or 'id'
  }).map(slide => {
    return (slide.zipName || slide.name);
  })
  //Print all slides about to be uploaded
  gutil.log(gutil.colors.green("Slides ready to be uploaded to Veeva FTP:"));
  uploadGlob.forEach(function(name){
    gutil.log(gutil.colors.green("  -",name));
  })
  prompt.start();
  prompt.get({
      name: 'continue',
      description: gutil.colors.green("Continue upload? (y/n)")
    }, function (err, result) {
      if(result.continue === 'y' || result.continue === 'yes'){
        runSequence("ftp-zip-upload", "ftp-ctl-upload", function(){
          cb();
          gutil.log(gutil.colors.green("Veeva .zip files successfully uploaded to FTP."));
          gutil.log(gutil.colors.green("Please allow a few minutes for files to be moved to salesforce."));
        });
      }
  });

});
gulp.task('deploy', ['build','clean:deploy'], function(cb){
  runSequence('zip-deploy', 'create-csv', function(){
    cb();
    gutil.log(gutil.colors.green("Packaging Complete"));
    gutil.log(gutil.colors.green(".csv, .zip and .ctl files located: at ~/deploy"));
  });
});
gulp.task('help', function(cb){
  //Display intro info
  introText.forEach(line => {
    gutil.log(gutil.colors.green(line));
  })
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCTIONS////////////////////////////////////////////////////////////////////////////////////////////////////
function ctlString(filename, tile){
  var str=[
    "USER=cloader@veeva.partner3.intouch",
    "PASSWORD=Intouch12345",
    //"EMAIL=''",
    //"NAME="+tile.keyName,
    //"Description_vod__c="+description,
    "FILENAME="+filename
  ], returnStr="";
  for(var ea of str){
    returnStr += ea+"\n";
  }
  return returnStr.toString();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADDONS////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('create-csv', function(cb) {
  var csvRows = [];
  var columnFields = ["Fields Only", "external_id__v", "name__v", "pres.title__v", "pres.external_id__c", "Type", "lifecycle__v", "pres.intended_segment_abv__c", "pres.franchise_abv__c", "pres.content_category_abv__c", "pres.commercial_vault_identifier_flag_abv__c", "pres.ready_to_use__c", "pres.country__v.name__v", "pres.brandedunbranded__c", "pres.disease_state__c", "pres.crm_training__v", "pres.crm_hidden__v", "pres.product__v.name__v", "pres.clm_content__v", "pres.crm_directory__v.external_id__v", "pres.crm_end_date__v", "pres.engage_content__v", "pres.crm_related_content_display_order__v", "pres.crm_start_date__v", "pres.website__v.name__v", "Presentation Link", "slide.title__v", "slide.external_id__c", "slide.country__v.name__v", "slide.crm_media_type__v", "slide.related_sub_pres__v", "slide.crm_shared_resource__v", "slide.related_shared_resource__v", "slide.product__v.name__v", "slide.ready_to_use__c", "slide.clm_content__v", "slide.crm_custom_reaction__v", "slide.crm_disable_actions__v", "slide.engage_content__v", "slide.filename", "slide.franchise_abv__c", "slide.content_category_abv__c", "slide.intended_segment_abv__c", "slide.commercial_vault_identifier_flag_abv__c"];
  //Header
  csvRows.push(columnFields);
  //Covert fields array to empty object
  var columnFields_obj = (function() {
    var obj = {};
    columnFields.forEach(col =>{ obj[col] = "" })
    return obj;
  })()
  //Check global CSV fields exist in columnFields
  _.keys(_.assign({}, config.CSV.all_fields, config.CSV.presentation_fields, config.CSV.slide_fields )).forEach(fields =>{
    if(columnFields.indexOf(fields) === -1){
      gutil.log(gutil.colors.red(gutil.colors.inverse("ERROR")+":",gutil.colors.underline(fields),"is not an existing csv column field"));
    }
  })
  //PRESENTATIONS////////////////////////////////////////////////////////////
  config.CLM_PRESENTATIONS.forEach(pres => {
    var presRow = JSON.parse(JSON.stringify(columnFields_obj)); //clone object
    var presCSV = pres.csv || {}; //custom csv
    //Add in global all csv properties
    presRow = _.merge(presRow, config.CSV.all_fields);
    //Add in global presentation csv properties
    presRow = _.merge(presRow, config.CSV.presentation_fields);
    //Set column Type as Presentation
    presRow["Type"] = "Presentation";
    //Assign presentation specific csv properties
    presRow = _.merge(presRow, presCSV);
    //Other assignment rules
    if(presRow["pres.title__v"]==="") presRow["pres.title__v"] = presRow["name__v"]; //Title
    //Add presentation row
    csvRows.push(_.values(presRow));
    //Check missing fields
    checkCSVSyntax(pres);

    //SLIDES//////////////////////////////////////////////////////////////////
    //Remove 'excluded' slides
    var slides = _.filter(pres.SLIDES, function(o) { return o["excluded"]===undefined || o["excluded"]==="false" });
    slides.forEach(slide => {
      var slideRow = JSON.parse(JSON.stringify(columnFields_obj)); //clone object
      var slideCSV = slide.csv || {}; //custom csv
      //Add in global all csv properties
      slideRow = _.merge(slideRow, config.CSV.all_fields);
      //Add in global slide csv properties
      slideRow = _.merge(slideRow, config.CSV.slide_fields);
      //Set column Type as Slide
      slideRow["Type"] = "Slide";
      //Assign slide specific csv properties
      slideRow = _.merge(slideRow, slideCSV);
      //Other assignment rules
      if(slideRow["name__v"]==="") slideRow["name__v"] = slide.name.split("-")[1]?slide.name.split("-")[1]:slide.name; //Name
      if(slideRow["slide.filename"]==="") slideRow["slide.filename"] = (slide.zipName || slide.name)+".zip"; //Filename
      if(slideRow["slide.title__v"]==="") slideRow["slide.title__v"] = slide.title || slide.name; //Title
      //Add slide row
      csvRows.push(_.values(slideRow));
      //Check missing fields
      checkCSVSyntax(slide);
    })
  })
  function checkCSVSyntax(obj){
    if(obj.csv){
      for(var field in obj.csv){
        if(!columnFields.includes(field)) {
          gutil.log(gutil.colors.red(gutil.colors.inverse("ERROR")+":",gutil.colors.underline(field),"of",gutil.colors.underline(obj.name || obj.id),"is not an existing csv column field"));
        }
      }
    }
  }

  stringify(csvRows, function(err, output){
    file((config.DEPLOY.filename || "veeva_multiloader")+'.csv', output, { src: true })
      .pipe(gulp.dest('deploy'));
    cb(err);
  });
});

//Attempts to migrate an old Intouch Veeva structure to the new
gulp.task('migration', ['clean:src'], function(cb) {
  var fileName = "";
  var sourcePath = gutil.env.source;
  if(!sourcePath){ console.log("source path flag is required (--source)"); return;}
  //Find html tile files and prompt for confirmation
  var htmlTileFiles = fs.readdirSync(sourcePath).filter(file => file.indexOf(".html") != -1);
  for(var i=0; i<htmlTileFiles.length; i++){
    var filename = htmlTileFiles[i].substring(htmlTileFiles[i].lastIndexOf("/")+1);
    gutil.log(gutil.colors.green((i+1)+":",filename));
  }
  gutil.log(gutil.colors.blue("Found",htmlTileFiles.length, "potential html slides"));
  prompt.start();
  prompt.get({
      name: 'htmlexclude',
      description: gutil.colors.blue("Please type the number(s) of the file(s) that are NOT slides\nPress enter to convert all to slides\n")
    }, function (err, result) {
      var slidesToExclude = result.htmlexclude.replace(',', '').split(" ").filter(index=>{
        return htmlTileFiles[parseInt(index)-1];
      }).map(index=>{ return htmlTileFiles[parseInt(index)-1] });
      htmlTileFiles = htmlTileFiles.filter(file=>{
        return slidesToExclude.indexOf(file) === -1;
      })
      //Create Shared folder
      var sharedGlob = htmlTileFiles.map(path=>"!"+sourcePath+"/"+path).concat([sourcePath+"/**/*.*"]);
      gulp.src(sharedGlob)
        .pipe(gulp.dest('src/shared'))
      //Create slides from html and route links to shared
      for(var i=0; i<htmlTileFiles.length; i++ ){
        var path = htmlTileFiles[i];
        var htmlPath = sourcePath+"/"+path;
        var styleBlock = "";
        fileName = path.substring(path.lastIndexOf("/")+1, path.lastIndexOf(".html"));
        //Add to config.js
        templateConfig.CLM_PRESENTATIONS[0].SLIDES.push({
          "id":i,
          "name": fileName
        });
        createView(htmlPath, fileName);
      }
      var configStr = "var config = " + JSON.stringify(templateConfig) +"\ntry{module.exports={config:config}}catch(e){}";
      //Create config.js
      file('config.js', configStr, { src: true })
        .pipe(plumber())
        .pipe(prettify())
        .pipe(gulp.dest(""))
  });
  function createView(htmlPath, fileName){
    var styleBlockRegx = /(<style([\S\s]*?)>)([\S\s]*?)(<\/style>)/i;
    //Create html and its local resources
    gulp.src(htmlPath)
      //Change source of href and src attributes
      .pipe(replace(/(?:href|src)=?['"]?.*?(['"]|\))/g, function(str){
        return sharedRepath(str);
      }))
      //Remove style block and create new scss from it
      .pipe(replace(styleBlockRegx, function(str){
        try{
          var match = str.match(styleBlockRegx);
          file('styles.scss', match[3], { src: true })
            .pipe(plumber())
            .pipe(replace(/url\s?\(['"]?.*?(['"]|\))/g, function(str){
              return sharedRepath(str, 2);
            }))
            .pipe(prettify())
            .pipe(gulp.dest("src/views/"+fileName+"/styles"))
            return '<link rel="stylesheet" href="styles/styles.css" type="text/css">';
        }catch(e){ return str }
      }))
      .pipe(prettify())
      .pipe(gulp.dest('src/views/'+fileName))
  }
})
//Change path of the resource to the shared folder
//depth = level of directories backwards the path should be looking for the shared folder
function sharedRepath(str, depth=1){
  try{
    if(str.indexOf("http") === -1 && str.indexOf(":void") === -1 && str.indexOf("shared/") === -1 && str.indexOf(".") != -1){
      var startMatch = str.match(/(?:href|src|url\s?\()=?['"]?/g)[0];
      var pathStart = str.indexOf(startMatch)+startMatch.length;
      if(pathStart === -1) return str;
      var depthStr = "";
      for(var i=0; i<depth; i++){
        depthStr += "../";
      }
      return str.slice(0, pathStart) + depthStr + "shared/" + str.slice(pathStart);
    }else{
      return str;
    }
  }catch(e){ return str }
}


var templateConfig = {
    //CLM_PRESENTATIONS
    //+ list each CLM presentation and the associated SLIDES/key messages
    //+ SLIDE properties are extended to the app (JS/HTML), use csv_overrides to add or override any CSV value
    //+ SLIDE.id - a numbered identity of the slide, represents its order
    //+ SLIDE.excluded - excludes slide from veeva packaging
    CLM_PRESENTATIONS: [{ //Main presentation
      SLIDES: []
    }],
    BUILD: { //Settings related to the build of the app (templating, compilation, testing, etc)

    },
    DEPLOY: { //Settings for Veeva deployment (FTP, Vault, etc)

    },
    CSV: {
        //These CSV fields are globally inherited to either presentation or slide, but do not override csv properties set above
        //all_fields: sets the value of the following column properties to every CSV row
        all_fields: {},
        //presentation_fields: sets the value of the following column properties to only presentations
        presentation_fields: {

        },
        //slide_fields: sets the value of the following column properties to only slides
        slide_fields: {

        }
    }
}

var introText = [
' _____   _____ ',
'|_ _\\ \\ / / _ )',
' | | \\ V /| _ \\',
'|___| \\_/ |___/',
'INTOUCH VEEVA BUILDER',
'______________________________________________________________________________',
'COMMAND LINE TASKS (usage --> gulp <task>)',
'______________________________________________________________________________',
'gulp ----------------- Builds app and auto loads local web server',
'gulp build ----------- Build ONLY, no localhost',
'gulp deploy ---------- Packages app, ready for Veeva deployment (.zip and .ctl)',
'gulp upload ---------- Uploads packaged files to Veeva dev test environment',
'gulp upload --slides   List comma seperated slide name or numbers (ex: 0,1,2,shared)',
'______________________________________________________________________________'
]
