var fs = require('fs');
var walk = function(dir, excludeDir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          var excluded = false;
          excludeDir.forEach(exDir => {
            console.log(file)
            console.log(exDir)
            if(file.indexOf(exDir) != -1){
              excluded=true;
            }
          });
          if(!excluded){
            walk(file, excludeDir, function(err, res) {
              results = results.concat(res);
              next();
            });
          }else{
            next();
          }
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};
function fileExt(file){
  return file.substring(file.lastIndexOf(".")+1)
}

var refs = "", images = [];
walk(".", ["/thumbnails","/minitiles"], function(err, results) {
  if (err) throw err;
  results.forEach(file => {
    switch(fileExt(file)){
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        images.push(file.substring(file.lastIndexOf("/")+1));
        break;
      case "html":
      case "css":
        refs+=fs.readFileSync(file, "utf-8");
        break;
    }
    if(file.indexOf("tileData.js") != -1){
      refs+=fs.readFileSync(file, "utf-8");
    }
  });
  images.forEach(img => {
      if (refs.indexOf(img) == -1) {
          console.log(img)
      }
  });
});
