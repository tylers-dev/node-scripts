function addAVIButton(){
	if(document.getElementById(aviInstance.parentElementAVIButton) !==undefined){
		var avibutton = document.createElement("div");
		//var parentElement = aviInstance.returnOptions("parentElementAVIButton");
		var parentElement = document.getElementById(aviInstance.parentElementAVIButton);
		avibutton.className = 'trainingbutton';
		avibutton.setAttribute('ontouchend', 'popupToggle(\'trainingmode\')');
		if(parentElement !==null && parentElement!== '' && parentElement !== undefined){
			console.log("Adding AVI button to:")
			console.dir(parentElement)
			setTimeout(function(){
				parentElement.appendChild(avibutton);
			}, 1500)
		}
	} else {
		console.log("Cannot find parent element on this slide.")	
	}
}