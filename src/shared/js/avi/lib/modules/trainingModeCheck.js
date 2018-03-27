com.veeva.clm.getDataForCurrentObject('Presentation', 'Training_vod__c', function(result){
	console.log("Checking Training Content status")
	if(result.Presentation.Training_vod__c === "true"){
		console.log("Presentation is marked as training content")
		sessionStorage.setItem("avi-presentationmarkedastrainingcontent", true)
	} else {
		console.log("Presentation is not marked as training content")
		sessionStorage.setItem("avi-presentationmarkedastrainingcontent", false)
	}
	getUsername()
});	