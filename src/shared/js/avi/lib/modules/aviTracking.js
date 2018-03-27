/*All intellectual property rights associated with this file remain with Intouch Solutions, Inc
// for the production of digital html, css, and javascript functionality owned and managed by AbbVie, Inc
// per the Intouch-AbbVie MSA section 1.12.  Usage of this code outside of AbbVie, Inc. is strictly prohibited.
*/
/* INTOUCH AVI TRACKING LIBRARY */

// must include the latest Veeva-library for this to work.

// Create AlloraTrack Class
// Purpose: Object for AVI Tracking Purposes
// Input:
// Output:

function aviTrack() {
    this.pageName = document.title;
    this.prop1 = "";
    this.prop2 = "";
    this.prop3 = "";
    this.prop4 = "";
    this.prop5 = "";
    this.prop6 = "";
    this.prop7 = "";
    this.prop8 = "";
    this.prop9 = "";
    this.prop10 = "";
    this.trackKey = "";
}

aviTrack.prototype.track = function (trackingValue) {
    var clickStream = {};

    clickStream.Track_Element_Description_vod__c = trackingValue;
	clickStream.Usage_Start_Time_vod__c = new Date();
    var myJSONText = JSON.stringify(clickStream);
    
	 //console.log("AVI Tracking:  " + JSON.stringify(myJSONText));
     com.veeva.clm.createRecord("Call_Clickstream_vod__c", clickStream, aviTrack.prototype.trackingCalled)
	 
	 //request = "veeva:saveObjectV2(Call_Clickstream_vod__c),value(" + myJSONText + "),callback(savedClickstream)";
     //document.location = request;
};

aviTrack.prototype.trackingCalled= function(result){
	console.log(result)
}

aviTrack.prototype.init = function () {
 
};
var aviClient = new aviTrack();
aviClient.init();
