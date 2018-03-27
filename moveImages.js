var fs = require('fs');

var tileHtmlMap = {};

//All index.html views mapped to object
var baseDir = "./src/views/";
var tilesViews = readdirSync(baseDir);
for(var i in tilesViews){
  var isDir = fs.statSync(baseDir+list[i]).isDirectory();
  if(isDir){
    var folder = baseDir+list[i];
    var htmlExists = fs.existsSync(folder+"/index.html");
    if(htmlExists){
      tileHtmlMap[folder] = fs.readFileSync(folder+"/index.html", "utf8");
    }
  }
}

//Scan all images, find the matching index.html, add to folder
fs.readdir(baseDir, function(err, list) {
  for(var i in list){
    var isDir = fs.statSync(baseDir+list[i]).isDirectory();
    if(isDir){
      var folder = baseDir+list[i];
      var htmlExists = fs.existsSync(folder+"/index.html");
      if(htmlExists){
        tileHtmlMap[folder] = fs.readFileSync(folder+"/index.html", "utf8");
      }
    }
  }
});

// fs.readdir("./src/shared/images", function(err, list) {
//   if (err) { return console.log(err) }
//
//   for(var image in list){
//
//   }
//   var i = 0;
//   var newSlideNum = null;
//   (function next(){
//     var file = list[i++];
//     if (!file) return false;
//     var pNum = "", fileNum = file.substr(4,2);
//     var fileData = fs.readFileSync("./src/"+file, "utf8");
//     var strSearch = 'class="project-num">';
//     var pNumIndex = fileData.indexOf(strSearch);
//     if(pNumIndex != -1){
//       pNum = fileData.substr(pNumIndex+strSearch.length, 15);
//       newSlideNum = orderMap[pNum];
//       if(newSlideNum && fileNum != newSlideNum){
//         console.log("'"+file +"' rename to: 'm01-"+ newSlideNum+".html'");
//       }
//       if(!newSlideNum){
//         for(var ea in orderMap){
//           if(orderMap[ea] === fileNum){
//             pNum = ea;
//             console.log("'"+file +"' update project num to: '" + pNum+"'");
//             break;
//           }
//         }
//       }
//     }
//     next();
//   })();
// });
