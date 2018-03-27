/*function accountCheckWorker(){
	this.onmessage = function(e) {
		var themessage = {message: "checking account from worker"}
		this.postMessage(themessage, e.data)
	}
	
	this.postMessage(location, themessage);
}*/

this.onmessage = function(e) {
	var themessage;
	accountCheckWorker()
	//var accountCheckInterval = setInterval(function(){ accountCheckWorker() }, 1000);
	function accountCheckWorker(){
		if( 'function' === typeof com) {
		com.veeva.clm.getDataForCurrentObject("Account","ID", function(){
			var previewmodemessage = 'getDataForCurrentObject: getDataForObject called with object which is not available in preview mode: Account';
			if(result.code === 1112 || result.message === previewmodemessage || result.success === false){
				console.log("callback:  not on call")
				themessage = {message: false}
				setTimeout(function(){
					accountCheckWorker()
				}, 1000)
			} else {
				console.log("callback:  assuming user is on call")
				themessage = {message: true}
				return
			}
		});
		}
		
		if(navigator.platform !="iPad"){
			console.log("Desktop developer reset")
			themessage = {message: false}
			setTimeout(function(){
					accountCheckWorker()
			}, 1000)
		}
		this.postMessage(themessage)
	}
	
}


//var accountCheckInterval = setInterval(function(){ accountCheckWorker() }, 1000);