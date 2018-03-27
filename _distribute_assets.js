//var fs = require('fs');
var fs = require('fs-extra');

//Find images used in CSS, consider them global and add to all tile folders
var globalImages = [];
var cssFiles = fs.readdirSync("./css");
for(var i in cssFiles){
  if(cssFiles[i].indexOf(".css") != -1){
    var cssFile = fs.readFileSync("./css/"+cssFiles[i], "utf8");
    var images = cssFile.match(/(\/images.*?\.\w{3})/img);
    for(var j in images){
      globalImages.push(images[j]);
    }
  }
}

//Create folders for every html, and move approriate files overflow
var packageDir = "./_packages/";
var htmlFiles = fs.readdirSync(".");
for(var i in htmlFiles){
  if(htmlFiles[i].indexOf(".html") != -1){
    var htmlFile = fs.readFileSync("./"+htmlFiles[i], "utf8");
    //Create folder and copy html
    var newFolder = packageDir+htmlFiles[i].split(".")[0]+"/";
    fs.copySync(htmlFiles[i], newFolder+htmlFiles[i]);
    //Find images and copy over
    var images = htmlFile.match(/(images.*?\.\w{3})/img);
    for(var j in images){
      try{
        fs.copySync(images[j], newFolder+images[j]);
      }catch(e){}
    }
    //Copy over all global images
    for(var j in globalImages){
      try{
        fs.copySync(globalImages[j], newFolder+globalImages[j]);
      }catch(e){}
    }
    //Copy over all css
    var globalCSS = fs.readdirSync("./css");
    for(var j in globalCSS){
      fs.copySync("./css/"+globalCSS[j], newFolder+"./css/"+globalCSS[j]);
    }
    //Copy over all js
    var globalJS = fs.readdirSync("./js");
    for(var j in globalJS){
      fs.copySync("./js/"+globalJS[j], newFolder+"./js/"+globalJS[j]);
    }
    //Copy over all fonts
    var globalFonts = fs.readdirSync("./fonts");
    for(var j in globalFonts){
      fs.copySync("./fonts/"+globalFonts[j], newFolder+"./fonts/"+globalFonts[j]);
    }
  }
}
