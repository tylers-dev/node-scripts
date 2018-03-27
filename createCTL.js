// createCTL.js
// Purpose: Used to create .CTL files that are used with Veeva ftp content uploads
// Usage: Run this file with cli node (node createCTL.js) inside the directory containing all your .zip files ready to upload

var fs = require('fs');

fs.readdir("./", function(err, zips){
  if(err) return err;
  zips.forEach(function(zip){
    if(zip.substr(-3) === "zip"){
      fs.writeFileSync("./"+zip.slice(0, -4)+".ctl", ctlString(zip));
    }
  })
})

function ctlString(filename){
  var str=[
    "USER=cloader@veeva.partner3.intouch",
    "PASSWORD=Intouch12345",
    //"NAME=""
    //"Description_vod__c=""
    "FILENAME="+filename
  ], returnStr="";
  for(var ea of str){
    returnStr += ea+"\n";
  }
  return returnStr.toString();
}
