var aviOptions = {
	"parentElementAVIButton":"customlayoutscontainer",
	"aviName":"Eva",
	"ISAName": "GluViva",
	"aviImplemenationDate":"2/11/2018"
}

/* Do not edit anything below */
var instanceObjectFromMemory = sessionStorage.getItem("avi-instance");
if(instanceObjectFromMemory !==null && instanceObjectFromMemory!==undefined && instanceObjectFromMemory!==''){
	var foundAVIinmemory = true;
} else {
	var foundAVIinmemory = false;
}


var requireLiteJS = [
	'core/autonomousVoiceInterface',  
	'topics/autonomousVoiceSubjects', 
	'topics/autonomousVoiceTopics', 
	'modules/addAVIButton',
	'modules/addAVIElements',
	'modules/getAndStoreUserInformation', 
	'modules/accountCheck',
	'modules/aviTracking',
	'modules/trainingModeCheck:avi.prototype.init('+ foundAVIinmemory + ')'
];

var voices, nextTopic, aviInstance, cancelAVI = false, accountPresent = true, attachedResetToElements = false, checkAnswerFunctionEnabled = false, checkAnswerSubject, checkAnswerTopic;

function avi(opts) {
	this.parentElementAVIButton = opts.parentElementAVIButton;
	this.AVIName = opts.aviName;
	this.ISAName = opts.ISAName;
	this.aviImplemenationDate = opts.aviImplemenationDate;
	this.environment = navigator.platform;
	this.AVIsubjects = {};
}

function initAccountCheck(){
	com.veeva.clm.getDataForCurrentObject("Account","ID", function(){
		//console.dir(result)
		var previewmodemessage = 'getDataForCurrentObject: getDataForObject called with object which is not available in preview mode: Account';
		if(result.code === 1112 || result.message === previewmodemessage || result.success === false){
			console.log("callback:  not on call")
			accountPresent = false;
			getVoices();
		} else {
			accountPresent = true;
			console.log("callback:  assuming user is on call")
		}
	});
	if(navigator.platform !=="iPad"){//testing on desktop
		accountPresent = false;
		getVoices();
		console.log("Desktop developer reset")
	}	
}

function getVoices(){
	// First speechSynthesis call
	voices = window.speechSynthesis.getVoices();
	console.log(voices);
			
	setTimeout(function(){
		// Second speechSynthesis call
		voices = window.speechSynthesis.getVoices();
		//return voices
		aviInstance = new avi(aviOptions);
		loadJSInMemory(requireLiteJS);
		console.log(voices);
	}, 1000)
}

function ajaxCall(dataurl, callback){
	console.info('Making Ajax call for ' + dataurl);
	console.info('Will fire callback:  ' + callback);
	
	var data, xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 || xmlhttp.readyState ==XMLHttpRequest.DONE ) {
			if(xmlhttp.status == 0 || xmlhttp.status == 200){
				data = xmlhttp.responseText;
				window.eval(data)
				if(callback!==null && callback !==undefined){
					setTimeout(function(){
						eval(callback);
					}, 500);
				}
			}
			else if(xmlhttp.status == 400) {
				console.log("status 400")
			}
			else {
				console.log("ajax call failed")
			}
		}
	}
	
	xmlhttp.open("GET", dataurl, true);
	xmlhttp.send();
}

function loadJSInMemory(scriptstoload){
	var loadedScriptAndCallback = scriptstoload[0].split(":");
	var thescriptstoload = scriptstoload.splice(1);
	ajaxCall('../shared/js/avi/lib/'+ loadedScriptAndCallback[0]  + '.js', loadedScriptAndCallback[1] ? loadedScriptAndCallback[1] : loadJSInMemory(thescriptstoload))
}

initAccountCheck();