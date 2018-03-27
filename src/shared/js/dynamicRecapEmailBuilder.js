function dynamicRecapBuilder(){
	this.dynamiccontent = '';
	//this.formattedHTMLContent = '';
}

dynamicRecapBuilder.prototype.init = function() {
	
}

dynamicRecapBuilder.prototype.buildList = function() {
	var pageList = [];
	pageList.length = 0;
	this.dynamiccontent = '';
	if(sessionStorage.getItem("CurrentRecapList") !==null && sessionStorage.getItem("CurrentRecapList") !==""){
		pageList = sessionStorage.getItem("CurrentRecapList").split(";");
	} else {
		pageList = null;
	}
	if(pageList !==null && pageList !==""){
		for(i=0; i<pageList.length; i++){
			if(pageList[i] !== ''){
				this.dynamiccontent += "<tr><td valign='top'><img class='recapimage' src='https://vv-agency-intouch.veevavault.com/api/public/E0F1C4AD3B5012F20D9DD26162F175B9/416/1/7/assetFiles/images/" +  this.lookUpSlideInfo('recapimage', pageList[i]) + ".png' width='113' /></td><td width='60' height='10'></td><td valign='middle'>" + this.lookUpSlideInfo('descriptionText', pageList[i]) + "</td></tr><tr><td height='20'></td><td height='20'></td><td height='20'></td></tr>"
			}
		}
	} else {
		this.dynamiccontent = '';
	}
	this.addContentSendEmail();
}

dynamicRecapBuilder.prototype.lookUpSlideInfo = function (parameter, valuetofind) {//Method to look up other attributes on the tile object from TileData.js
	for (var key in recap) {
    	if (recap[key].check === valuetofind) {
        	switch (parameter) {
                case "recapimage":
                	return recap[key].recapimage;
                case "descriptionText":
                	return recap[key].descriptionText;
                default:
                	return recap[key].descriptionText;
            }
        }
    }
}

dynamicRecapBuilder.prototype.clearPreviousContent = function() {
	var blankEmailContent = "";
	com.veeva.clm.getDataForCurrentObject("Account","GluVivaDynamicEmailContent__c", function(){dynamicRecapBuilder.prototype.updateBlankContent(result, blankEmailContent);});
}

dynamicRecapBuilder.prototype.updateBlankContent = function(resultfromaddcontent, data){
	if(resultfromaddcontent.success = "true"){//Have to use loose typing for some reason, otherwise this won't return correctly.
		var UpdateObject={};
		UpdateObject.GluVivaDynamicEmailContent__c = data;
		com.veeva.clm.updateCurrentRecord("Account", UpdateObject, function(){setTimeout(function(){dynamicRecapBuilder.prototype.updateBlankComplete();}, 500)});
		console.log("updateContent success")
	} else {
		console.log("update content fail")
	}
}

dynamicRecapBuilder.prototype.updateBlankComplete = function(){
	console.log("blanked email content")
}


dynamicRecapBuilder.prototype.addContentSendEmail = function() {
	var emailContent = this.formatHTMLforEmail();
	//console.log(emailContent)
	com.veeva.clm.getDataForCurrentObject("Account","GluVivaDynamicEmailContent__c", function(){dynamicRecapBuilder.prototype.updateContent(result, emailContent);});
}

dynamicRecapBuilder.prototype.formatHTMLforEmail = function(){
	var formattedHTMLContent = this.dynamiccontent.replace(/"/g, "'");
	formattedHTMLContent = formattedHTMLContent.replace(/\n|\r|\t/g, "");
	formattedHTMLContent = formattedHTMLContent.replace(/\t/g, "");
	return formattedHTMLContent;
	 
}
	
dynamicRecapBuilder.prototype.updateContent = function(resultfromaddcontent, data){
	console.dir(resultfromaddcontent)
	if(resultfromaddcontent.success = "true"){//Have to use loose typing for some reason, otherwise this won't return correctly.
		var UpdateObject={};
		UpdateObject.GluVivaDynamicEmailContent__c = data;
		com.veeva.clm.updateCurrentRecord("Account", UpdateObject, function(){setTimeout(function(){dynamicRecapBuilder.prototype.updateComplete();}, 500)});
		console.log("updateContent success")
	} else {
		console.log("update content fail")
	}
}
		
dynamicRecapBuilder.prototype.updateComplete = function(){
	console.log("should be launching the email")
	com.veeva.clm.launchApprovedEmail("GluViva - Veeva Summit", "", function(){dynamicRecapBuilder.prototype.finalCallback()})
}
		
dynamicRecapBuilder.prototype.finalCallback = function(){
	console.log("final callback")
}

dynamicRecapBuilder.prototype.resetContent = function(resultfromaddcontent, data){
	if(resultfromaddcontent.success = "true"){//Have to use loose typing for some reason, otherwise this won't return correctly.
		var UpdateObject={};
		UpdateObject.GluVivaDynamicEmailContent__c = data;
		//console.log(data)
		com.veeva.clm.updateCurrentRecord("Account", UpdateObject, function(){dynamicRecapBuilder.prototype.finalCallback()});
		console.log("reset success")
	} else {
		
	}
}


function recordDynamicEmailPointer(itemtoadd) {
	var currentList = [], updatedList = [], recapString='';
	if(sessionStorage.getItem("CurrentRecapList") !==null && sessionStorage.getItem("CurrentRecapList") !==""){
		currentList = sessionStorage.getItem("CurrentRecapList").split(";");
		if(currentList.indexOf(itemtoadd)===-1){//add it
			currentList.push(itemtoadd);
		} else {//remove it
			currentList.splice(currentList.indexOf(itemtoadd), 1)
		}
		updatedList = currentList;
	} else {
		updatedList.push(itemtoadd);
	}
	
	for(i=0; i<updatedList.length; i++){
		if(i !== updatedList.length - 1){
			recapString += updatedList[i] + ";";
		} else {
			recapString += updatedList[i];	
		}
	}
	sessionStorage.setItem("CurrentRecapList", recapString);
}

var freshRecap = new dynamicRecapBuilder();
freshRecap.init();

