var currentUserPath = sessionStorage.getItem("currentPath"); 
if(sessionStorage.getItem("previousPath") !==null  &&sessionStorage.getItem("previousPath") !==''){//found a previous path
	if(sessionStorage.getItem("previousPath") !==currentUserPath){//User is in different path, clear out the recap list session storage
		console.log("clearing current recap list")
		sessionStorage.setItem("CurrentSlideRecapList", '');
		sessionStorage.setItem("previousPath", currentUserPath);
	} else {
		console.log("found previous path, not clearing because user is in same path")
		//same path, do nothing
	}
} else {
	console.log("No previous path, doing nothing")
	//do nothing
}



setTimeout(function(){
	recordDynamicEmailPointer();
}, 500);


function recordDynamicEmailPointer() {
	var currentList = [], updatedList = [], recapString='';
	
	if(sessionStorage.getItem("CurrentSlideRecapList") !==null && sessionStorage.getItem("CurrentSlideRecapList") !==""){
		currentList = sessionStorage.getItem("CurrentSlideRecapList").split(";");
		if(currentList.indexOf(zipName)===-1){
			currentList.push(zipName);
		} 
		updatedList = currentList;
	} else {
		updatedList.push(zipName);
	}
		//console.dir(updatedList)
	for(i=0; i<updatedList.length; i++){
		if(updatedList[i] !==""){
			recapString += updatedList[i] + ";";
		}
	}
	sessionStorage.setItem("CurrentSlideRecapList", recapString);
}