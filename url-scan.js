var fs = require("fs");
var dir = require("node-dir");
var path = require('path');
var jsonfile = require("jsonfile");
var request = require("request");
var _ = require('lodash');

//everything but index.html
//^(?!index.html).*index.*\.html$

var jsonObj = {};
var excludeFilesList = /^(?!index.html).*index.*\.html$/i;
var excludeDirList = ['gulp', 'testing', 'includes_old', 'node_modules'];
jsonObj.all_pods = [];
jsonObj.ref_pods = [];
jsonObj.urls = {};
jsonObj.urls.meta_redirects = [];

var baseDir = "C:/MAMP/htdocs";
// dir.readFiles(baseDir,{
//     match: /.html$/,
//     exclude: excludeFilesList,
//     excludeDir: excludeDirList,
//     doneOnErr: false
// },function(err, content, filename, next) {
//     var baseUrl = path.normalize(filename).substring(baseDir.length).replace(/(\\|\.\.\\)/g,"/");

//     //Add urls and organize them by their response status////////////////////////////////////
//     //if(baseUrl.lastIndexOf("/index.html") >= 0){
//     if(content.indexOf("data-hrb-imgdata") >= 0){
//         var absUrl = "https://www.hrblock.com" + baseUrl;
//         if(content.indexOf('<meta http-equiv="refresh"') >= 0){
//             jsonObj.urls.meta_redirects.push(absUrl);
//         }else{
//             request({
//                 url: absUrl,
//                 followRedirect: false
//             }, function (error, response, body) {
//                 if(error) console.log('error:', error);
//                 var statusCode = response && response.statusCode;
//                 if(statusCode) {
//                     if(statusCode===200) console.log(baseUrl)
//                     //if(!(statusCode in jsonObj.urls)) jsonObj.urls[statusCode] = [];
//                     //jsonObj.urls[statusCode].push(absUrl);
//                 }
//             });
//         }
//     }
//     next();
//     return false;

//     //All pods on server/////////////////////////////////////////////////////////////////
//     if(baseUrl.indexOf("/includes/pods/") === 0) jsonObj.all_pods.push(baseUrl);

//     //All referenced pods///////////////////////////////////////////////////////////////
//     var podIncludes = content.match(/<!--#include virtual=("?\/includes\/pods.*"?)-->/g);
//     if(podIncludes) {
//         let paths = podIncludes.filter(pod=>{
//             return pod.indexOf("/*") === -1;
//         }).map(pod => {
//             var shortMatch = pod.match(/\/includes\/pods(.*?).html/);
//             if(shortMatch) {
//                 return shortMatch[0];
//             }
//         })
//         jsonObj.ref_pods.push(paths);
//     }
//     next();
// },function(err, files){
//     console.log("done");
//     jsonObj.ref_pods = _.uniq(_.flattenDeep(jsonObj.ref_pods));
//     jsonObj.unused_pods = _.difference(jsonObj.all_pods, jsonObj.ref_pods);
//     jsonfile.writeFile("output.json", jsonObj, {spaces: 2, EOL: '\r\n'}, function (err) {
//         //console.error(err)
//     })
// });


var imgdataFiles = ["/includes/pods/general/general--404-error-hero--span-12.html",
"/includes/pods/online/online--filing-online-is-easy--span-6.html",
"/espanol/includes/pods/financial/financial--bank-forms-marquee--span-12.html",
"/includes/pods/financial/financial--bank-forms-marquee--span-12.html",
"/espanol/includes/pods/financial/financial--privacy-statement-marquee--span-12.html",
"/includes/pods/financial/financial--privacy-statement-marquee--span-12.html",
"/includes/pods/general/general--your-refund-your-way--span-4.html",
"/includes/pods/manage-your-health/manage-health--body-1--span-12.html",
"/includes/pods/manage-your-health/manage-health--go-health--span-6.html",
"/includes/pods/manage-your-health/manage-health--health-care-tax--span-6.html",
"/includes/pods/manage-your-health/manage-health--marquee-1--span-12.html",
"/includes/pods/online/online--file-online-its-easy--span-4.html",
"/includes/pods/retail/retail--find-an-office--span-4.html",
"/includes/pods/corporate/corporate--career-our-newsroom--span-4.html",
"/includes/pods/corporate/corporate--career-talent-community--span-4.html",
"/includes/pods/landing-pages/careers/careers--why-work-at-block-body-1--span12.html",
"/includes/pods/financial/financial--tax-refund-savings-ec-epockets-offer-marquee-1--span12.html",
"/includes/pods/financial/financial--tax-refund-savings-set-aside-refund-marquee-1--span12.html",
"/includes/pods/online/guarantees/guarantees--accuracy-of-calculations-marquee-1--span-12.html",
"/includes/pods/online/guarantees/guarantees--worry-free-audit-support-terms-marquee--span-12.html",
"/includes/pods/online/guarantees/guarantees--worry-free-audit-support-marquee-1--span-12.html",
"/includes/pods/financial/financial--emerald-card-control-finances-learn-more-1--span-6.html",
"/includes/pods/mobile/mobile--download-free-apps--span-6.html",
"/includes/pods/online/online--tax-prep-finish-my-return-body-1--span-12.html",
"/includes/pods/online/online--tax-prep-save-marquee-1--span-12.html",
"/includes/pods/financial/emerald/financial--emerald-card-cash-rewards--span-12.html",
"/includes/pods/mobile/mobile--download-free-apps--span-6.html",
"/includes/pods/online/online--tax-prep-thankyou-marquee-1--span-12.html",
"/includes/pods/financial/financial--emerald-card-control-finances-learn-more-1--span-6.html",
"/includes/pods/mobile/mobile--download-free-apps--span-6.html",
"/includes/pods/online/online--tax-prep-finish-my-return-body-1--span-12.html",
"/includes/pods/online/online--tax-prep-save-marquee-1--span-12.html",
"/includes/pods/financial/financial--emerald-advance-learn-more-1--span-6.html",
"/includes/pods/online/online--tax-prep-thankyou-marquee-1--span-12.html",
"/includes/pods/general/pr-general--404-error-hero--span-12.html",
"/includes/pods/corporate/pr-corporate--income-tax-course-body--span-12.html",
"/includes/pods/corporate/pr-corporate--income-tax-course-marquee--span-12.html",
"/includes/pods/corporate/pr-corporate--itc-more-questions--span-4.html",
"/includes/pods/corporate/pr-corporate--itc-sample-course--span-4.html",
"/includes/pods/corporate/pr-corporate--itc-tax-knowledge--span-4.html",
"/includes/pods/sts/sts--avanade-marquee-1--span12.html",
"/includes/pods/sts/sts--sorry-marquee-1--span12.html",
"/includes/pods/sts/sts--thanks-marquee-1--span12.html",
"/includes/pods/supplier/supplier--marquee-1--span-12.html",
"/includes/pods/support/support--contact-us-1--span12.html",
"/includes/pods/support/support--tax-software-help-marquee--span12.html",
"/includes/pods/general/general--blog-read-it--span-4.html",
"/includes/pods/general/general--community--span-4.html",
"/includes/pods/get-answers/answers--tax-video--span-4.html",
"/includes/pods/support/support--tax-software-form--span6.html",
"/includes/pods/support/support--tax-software-howtouse--span6.html",
"/includes/pods/support/support--tax-software-landing-marquee1--span12.html",
"/includes/pods/support/support--contact-us-1--span12.html",
"/includes/pods/support/support--tax-software-help-marquee--span12.html",
"/includes/pods/general/general--blog-read-it--span-4.html",
"/includes/pods/general/general--community--span-4.html",
"/includes/pods/get-answers/answers--tax-video--span-4.html",
"/includes/pods/support/support--tax-software-form--span6.html",
"/includes/pods/support/support--tax-software-howtouse--span6.html",
"/includes/pods/support/support--tax-software-landing-marquee1--span12.html",
"/includes/pods/support/support--contact-us-1--span12.html",
"/includes/pods/support/support--tax-software-help-marquee--span12.html",
"/includes/pods/general/general--blog-read-it--span-4.html",
"/includes/pods/general/general--community--span-4.html",
"/includes/pods/get-answers/answers--tax-video--span-4.html",
"/includes/pods/support/support--tax-software-form--span6.html",
"/includes/pods/support/support--tax-software-howtouse--span6.html",
"/includes/pods/support/support--tax-software-landing-marquee1--span12.html",
"/includes/pods/retail/retail--find-an-office--span-12.html",
"/includes/pods/software/preorder/software--preorder-direct-homepage-marquee-1--span-12.html",
"/includes/pods/software/preorder/software--preorder-direct-homepage-marquee-1--span-12.html",
"/includes/pods/software/preorder/software--preorder-direct-homepage-marquee-1--span-12.html",
"/includes/pods/online/online--write-a-review--span-12.html",
"/includes/pods/financial/financial--refund-anticipation-check-deduct--span-6.html",
"/includes/pods/retail/retail--income-tax-preparers-marquee--span-12.html",
"/includes/pods/retail/retail--w2-early-access--span-6.html",
"/includes/pods/retail/retail--prepare-taxes-marquee--span-12.html",
"/espanol/includes/pods/retail/retail--sbs-checklist-marquee-1--span-12.html",
"/includes/pods/retail/retail--sbs-checklist-marquee-1--span-12.html",
"/includes/pods/retail/retail--write-a-review--span-12.html",
"/includes/pods/financial/emerald/financial--emerald-card-cash-rewards--span-4.html",
"/includes/pods/online/online--file-online-its-easy--span-4.html",
"/includes/pods/retail/retail--find-an-office--span-4.html",
"/includes/pods/retail/retail--wheres-my-refund-marquee--span-12.html",
"/includes/pods/financial/financial--emerald-advance-learn-more-1--span-6.html",
"/includes/pods/software/software--tax-prep-thankyou-marquee-1--span-12.html",
"/includes/pods/mobile/mobile--download-free-apps--span-4.html",
"/includes/pods/retail/retail--second-look-money-on-table--span-4.html",
"/includes/pods/software/back-editions/software--back-editions-2006-body-1--span-12.html",
"/includes/pods/software/back-editions/software--back-editions-marquee-1--span-12.html",
"/includes/pods/mobile/mobile--download-free-apps--span-4.html",
"/includes/pods/retail/retail--second-look-money-on-table--span-4.html",
"/includes/pods/software/back-editions/software--back-editions-2007-body-1--span-12.html",
"/includes/pods/software/back-editions/software--back-editions-marquee-1--span-12.html"]

var total = 0;
imgdataFiles.forEach(file=>{
    var filePath = baseDir+file;
    var fileContents = fs.readFileSync(filePath, 'utf8');
    total += fileContents.match(/imgdata/g).length;
})
console.log(total)