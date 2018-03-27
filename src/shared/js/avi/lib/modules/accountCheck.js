function accountCheck(){
	console.log("checking for account")
	com.veeva.clm.getDataForCurrentObject("Account","ID", function(){
		var previewmodemessage = 'getDataForCurrentObject: getDataForObject called with object which is not available in preview mode: Account';
		if(result.code === 1112 || result.message === previewmodemessage || result.success === false){
			console.log("callback:  not on call")
			accountPresent = false;
		} else {
			document.body.classList.add("accountpresent");
			accountPresent = true;
			aviInstance.resetAVI();
			console.log("callback:  assuming user is on call")
		}
	});
	if(aviInstance.environment !=="iPad"){
		accountPresent = false;
		console.log("Desktop developer reset")
	}
	
}