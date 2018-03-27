function getUsername(){
	console.log("Getting Username")
	var name = "";
	com.veeva.clm.getDataForCurrentObject('User', 'FirstName', function(result){
		console.log("Call Complete for username")
		if(result.User.FirstName){
			console.log("Found username")
			name = " " + result.User.FirstName;
		} else {
			console.log("No username")
			name = "";
		}
		sessionStorage.setItem("avi-username", name);
	});	
}

//Testing purposes only
//sessionStorage.setItem("avi-username", 'Chuck')