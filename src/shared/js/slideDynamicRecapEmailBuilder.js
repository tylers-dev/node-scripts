function slideDynamicRecapBuilder(){
	this.dynamiccontent = '';
	console.log("got here")
	//this.formattedHTMLContent = '';
}

slideDynamicRecapBuilder.prototype.init = function() {
	this.buildList();
	recaplist.addEventListener("touchstart", function(){userCanJump = false}, false);
	recaplist.addEventListener("touchend", function(){userCanJump = true}, false);
}

slideDynamicRecapBuilder.prototype.buildList = function() {
	var pageList = [];
	pageList.length = 0;
	this.dynamiccontent = '';
	if(sessionStorage.getItem("CurrentSlideRecapList") !==null && sessionStorage.getItem("CurrentSlideRecapList") !==""){
		pageList = sessionStorage.getItem("CurrentSlideRecapList").split(";");
	} else {
		pageList = null;
	}
	//pageList = ['GluVivaKinesis-overview.zip', 'GluVivaKinesis-efficacy.zip', 'GluVivaKinesis-patientprofiles.zip', 'GluVivaKinesis-injectionsites.zip', 'GluVivaKinesis-formulary.zip']
	
	if(pageList !==null && pageList !==""){
		console.log("here")
		for(i=0; i<pageList.length; i++){
			if(pageList[i] !== ''){
				recaplist.innerHTML+='<li class="removed" data-zipname="'+ pageList[i] +'"><div class="whitebackground"></div><div class="img"><img src="../shared/images/'+ this.lookUpSlideInfo('recapimage', pageList[i]) +'" width="163" height="122" /></div><div class="addbutton" ontouchend="slideDynamicRecapBuilder.prototype.addSlide(this)"></div><div class="removebutton" ontouchend="slideDynamicRecapBuilder.prototype.removeSlide(this)"></div><h4>'+ this.lookUpSlideInfo('title', pageList[i])  +'</h4><p>'+ this.lookUpSlideInfo('descriptionText', pageList[i]) +'</p></li>'
			}
		}
	} else {
		recaplist.innerHTML='<li><h4>No summary content</h4></li>';
		this.dynamiccontent = '';
	}
	//this.addContentSendEmail();
}

slideDynamicRecapBuilder.prototype.removeSlide=function(slide){
	console.log(slide.parentElement.dataset.zipname)
	slide.parentElement.classList.add('removed');
	slide.parentElement.classList.remove("emailable");
}

slideDynamicRecapBuilder.prototype.addSlide=function(slide){
	console.log(slide.parentElement.dataset.zipname)
	slide.parentElement.classList.remove('removed');
	slide.parentElement.classList.add("emailable");
}

slideDynamicRecapBuilder.prototype.lookUpSlideInfo = function (parameter, valuetofind) {//Method to look up other attributes on the tile object from TileData.js
	for (var key in sliderecapdata) {
    	if (sliderecapdata[key].zipName === valuetofind) {
        	switch (parameter) {
                case "recapimage":
                	return sliderecapdata[key].recapimage;
                case "descriptionText":
                	return sliderecapdata[key].descriptionText;
				case "title":
                	return sliderecapdata[key].title;
				case "contentID":
                	return sliderecapdata[key].contentID;
                default:
                	return sliderecapdata[key].descriptionText;
            }
        }
    }
}

slideDynamicRecapBuilder.prototype.clearPreviousContent = function() {
	var blankEmailContent = "";
	com.veeva.clm.getDataForCurrentObject("Account","GluVivaSlideDynamicEmailContent__c", function(){slideDynamicRecapBuilder.prototype.updateBlankContent(result, blankEmailContent);});
}

slideDynamicRecapBuilder.prototype.updateBlankContent = function(resultfromaddcontent, data){
	if(resultfromaddcontent.success = "true"){//Have to use loose typing for some reason, otherwise this won't return correctly.
		var UpdateObject={};
		UpdateObject.GluVivaSlideDynamicEmailContent__c = data;
		com.veeva.clm.updateCurrentRecord("Account", UpdateObject, function(){setTimeout(function(){slideDynamicRecapBuilder.prototype.updateBlankComplete();}, 500)});
		console.log("updateContent success")
	} else {
		console.log("update content fail")
	}
}

slideDynamicRecapBuilder.prototype.updateBlankComplete = function(){
	console.log("blanked email content")
}


slideDynamicRecapBuilder.prototype.addContentSendEmail = function() {
	var emailContent = this.formatHTMLforEmail();
	console.log(emailContent)
	com.veeva.clm.getDataForCurrentObject("Account","GluVivaSlideDynamicEmailContent__c", function(){slideDynamicRecapBuilder.prototype.updateContent(result, emailContent);});
}

slideDynamicRecapBuilder.prototype.formatHTMLforEmail = function(){
	tempTable.innerHTML='';
	var itemsToSend = document.getElementsByClassName("emailable");
	if (itemsToSend.length>0){
		for(i=0; i<itemsToSend.length; i++){
			var itemToSendLookup = itemsToSend[i].dataset.zipname;
			tempTable.innerHTML += '<tr><td style="background:#1a376e" width="100%" height="3"><img src="https://cdnae1.vod309.com/7eccbc28-9098-4260-b33d-3f78708d6a5a/0000000/000000/001/014/1/4/assetFiles/images/images/spacer.gif" height="3" /></td></tr><tr><td><table cellpadding="0" cellspacing="0" style="background:#efefef; width:100%;"><tr><td style="padding:15px; width:178px"><img src="https://cdnae1.vod309.com/7eccbc28-9098-4260-b33d-3f78708d6a5a/0000000/000000/001/014/1/4/assetFiles/images/images/'+ this.lookUpSlideInfo('recapimage', itemToSendLookup)  +'" width="163" height="122" /></td><td><img src="https://cdnae1.vod309.com/7eccbc28-9098-4260-b33d-3f78708d6a5a/0000000/000000/001/014/1/4/assetFiles/images/images/spacer.gif" width="5" /></td><td valign="middle" align="left" style="padding:15px"><font face="Arial, Helvetica, sans-serif" color="#461e6c" style="font-size:30px;line-height: 35px;"><strong>'+ this.lookUpSlideInfo('title', itemToSendLookup) +'</strong></font><br /><font face="Arial, Helvetica, sans-serif" color="#3e3d3d" style="font-size:15px;line-height: 17px;">'+ this.lookUpSlideInfo('descriptionText', itemToSendLookup) +'</font></td></tr><tr><td><img src="https://cdnae1.vod309.com/7eccbc28-9098-4260-b33d-3f78708d6a5a/0000000/000000/001/014/1/4/assetFiles/images/images/spacer.gif" height="5" /></td><td><img src="https://cdnae1.vod309.com/7eccbc28-9098-4260-b33d-3f78708d6a5a/0000000/000000/001/014/1/4/assetFiles/images/images/spacer.gif" width="5" /></td><td><img src="https://cdnae1.vod309.com/7eccbc28-9098-4260-b33d-3f78708d6a5a/0000000/000000/001/014/1/4/assetFiles/images/images/spacer.gif" height="5" /></td></tr></table></td></tr><tr><td height="20"><img src="https://cdnae1.vod309.com/7eccbc28-9098-4260-b33d-3f78708d6a5a/0000000/000000/001/014/1/4/assetFiles/images/images/spacer.gif" height="20" /></td></tr>';	
		}
	
		this.dynamiccontent = tempTable.innerHTML;
		var formattedHTMLContent = this.dynamiccontent.replace(/"/g, "'");
		formattedHTMLContent = formattedHTMLContent.replace(/\n|\r|\t/g, "");
		formattedHTMLContent = formattedHTMLContent.replace(/\t/g, "");
		return formattedHTMLContent;
	} else {
		return	
	}
}
	
slideDynamicRecapBuilder.prototype.updateContent = function(resultfromaddcontent, data){
	console.dir(resultfromaddcontent)
	if(resultfromaddcontent.success = "true"){//Have to use loose typing for some reason, otherwise this won't return correctly.
		var UpdateObject={};
		UpdateObject.GluVivaSlideDynamicEmailContent__c = data;
		com.veeva.clm.updateCurrentRecord("Account", UpdateObject, function(){setTimeout(function(){slideDynamicRecapBuilder.prototype.sendEmail();}, 500)});
		console.log("updateContent success")
	} else {
		console.log("update content fail")
	}
}

slideDynamicRecapBuilder.prototype.sendEmail = function(){
	console.log("send email")
	com.veeva.clm.getApprovedDocument("https://vv-agency-intouch.veevavault.com", "1014", function(){slideDynamicRecapBuilder.prototype.launchEmail(result)})
}
		
slideDynamicRecapBuilder.prototype.launchEmail = function(resultfromgetapproveddocument){
	console.log("should be launching the email")
	var template = resultfromgetapproveddocument.Approved_Document_vod__c[0].ID;
	console.log("template:  " + template)
	com.veeva.clm.launchApprovedEmail(template, "", function(){slideDynamicRecapBuilder.prototype.emailLaunched()})	
}
				
slideDynamicRecapBuilder.prototype.emailLaunched = function(){
	console.log("emailLaunched")
}

		
/*slideDynamicRecapBuilder.prototype.updateComplete = function(){
	console.log("should be launching the email")
	com.veeva.clm.launchApprovedEmail("GluViva - Veeva Summit", "", function(){slideDynamicRecapBuilder.prototype.finalCallback()})
}*/
		
slideDynamicRecapBuilder.prototype.finalCallback = function(){
	console.log("final callback")
}

slideDynamicRecapBuilder.prototype.resetContent = function(resultfromaddcontent, data){
	if(resultfromaddcontent.success = "true"){//Have to use loose typing for some reason, otherwise this won't return correctly.
		var UpdateObject={};
		UpdateObject.GluVivaSlideDynamicEmailContent__c = data;
		//console.log(data)
		com.veeva.clm.updateCurrentRecord("Account", UpdateObject, function(){slideDynamicRecapBuilder.prototype.finalCallback()});
		console.log("reset success")
	} else {
		
	}
}


function recordDynamicEmailPointer(itemtoadd) {
	var currentList = [], updatedList = [], recapString='';
	if(sessionStorage.getItem("CurrentSlideRecapList") !==null && sessionStorage.getItem("CurrentSlideRecapList") !==""){
		currentList = sessionStorage.getItem("CurrentSlideRecapList").split(";");
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
	sessionStorage.setItem("CurrentSlideRecapList", recapString);
}

var freshRecap = new slideDynamicRecapBuilder();
freshRecap.init();

