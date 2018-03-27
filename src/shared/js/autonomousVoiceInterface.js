// First speechSynthesis call
var voices = window.speechSynthesis.getVoices();
console.log(voices);
		
setTimeout(function(){
	// Second speechSynthesis call
	voices = window.speechSynthesis.getVoices();
	console.log(voices);
}, 1000)

var autonomousVoiceInterface = {
	init: function(options){
		this.name = options.name;
		this.product = options.product;
		this.avilight = options.avilight;
		this.environment = navigator.platform;
		this.voices = voices;
		var previousTopic = sessionStorage.getItem("avi-previousTopic");
		if(this.avilight){
			avi.classList.add("avilight")
		} else {
			avi.classList.remove("avilight")
		}
		
		
		if(previousTopic!==null && previousTopic!==''&& previousTopic!==undefined){
			console.log("found previous")
			for (var i = 0; i < topics.length; i++){
				if (topics[i].name == previousTopic){
					var nexttopic = topics[i].nextTopic;
					console.log("found next")
					this.askAVI(nexttopic)
				} else {
					console.log("found nothing")
				}
			}	
		} else {
			this.askAVI()	
		}
	},
	
	testXML: function(){
		var msg = new SpeechSynthesisUtterance();
		msg.text = '<?xml version="1.0"?>\r\n<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><emphasis>Welcome</emphasis> to the Bird Seed Emporium.  Welcome to the Bird Seed Emporium.</speak>';
		msg.lang = 'en';
		speechSynthesis.speak(msg);
	},
	
	askAVI: function(topic) {
		console.log("Topic passed:  "+ topic)
		sessionStorage.setItem("avi-open", true);
		var usertextresponse = '', avitextresponse = '', avivoiceresponse = '', nexttopic = '', currenttopic, action = '';
		if(topic){
			currenttopic = topic;
			sessionStorage.setItem("avi-previousTopic", currenttopic)
			for (var i = 0; i < topics.length; i++){
				if (topics[i].name == currenttopic){
					usertextresponse = topics[i].userresponsetext;
					avitextresponse = topics[i].aviresponse[0].text;
					avivoiceresponse = topics[i].aviresponse[0].voice;
					nexttopic = topics[i].nextTopic;
					action = topics[i].action;
				}
			}
			if(usertextresponse !== "" && usertextresponse!== undefined && !speechSynthesis.speaking){
				if(this.avilight){
					avichatwindow.innerHTML = '<div class="user-response">' + usertextresponse + '</div>';
				} else {
					avichatwindow.innerHTML += '<div class="user-response">' + usertextresponse + '</div>';	
				}
				
			}
			setTimeout(function(){
				autonomousVoiceInterface.speakAVI(nexttopic, action, avitextresponse, avivoiceresponse)
			}, 750)
		} else {
			setTimeout(function(){
				autonomousVoiceInterface.speakAVI()
			}, 750)
		}
	},
	
	speakAVI: function(nexttopic, action, avitextresponse, avivoiceresponse){
		window.utterances = [];
		if(nexttopic && action=== undefined){
			var utterance = new SpeechSynthesisUtterance(avivoiceresponse);
			if(this.environment!=="iPad"){
				utterance.voice = this.voices[20];
				utterance.lang = this.voices[20].lang;
			}
			utterances.push( utterance );
			if(!speechSynthesis.speaking){
				this.avichatwindow(avitextresponse)
			}
			utterance.onend = function(e) {
				if(nexttopic !=="ENDOFPATH"){
					autonomousVoiceInterface.askAVI(nexttopic);
				}
			}
		} else if(action!== undefined){
			var utterance = new SpeechSynthesisUtterance(avivoiceresponse);
			if(this.environment!=="iPad"){
				utterance.voice = this.voices[20];
				utterance.lang = this.voices[20].lang;
			}
			utterances.push( utterance );
			this.avichatwindow(avitextresponse)
			utterance.onend = function(e) {
				var theaction = window[action];
				theaction();
			}
		} else {
			var utterance = new SpeechSynthesisUtterance('Hi, I\'m ' + autonomousVoiceInterface.name + '.  How can I help you?');
			if(this.environment!=="iPad"){
				utterance.voice = this.voices[20];
				utterance.lang = this.voices[20].lang;
			}
			utterances.push( utterance );
			if(!speechSynthesis.speaking){	
				this.avichatwindow('Hi, I\'m ' + autonomousVoiceInterface.name + '.  How can I help you?')
			}
		}
		
		console.log("Speaking:  " + speechSynthesis.speaking)
		if(!speechSynthesis.speaking){							
			speechSynthesis.speak( utterance );
		} else {
			console.log("thinks its speaking")	
		}
		utterance.onerror = function(e) {
			console.log("Voice error:")
			console.dir(e);
		}
	},
	
	avichatwindow: function(avitextresponse){
		if(this.avilight){	
			avichatwindow.innerHTML = '<div class="avi-response"><div class="avi-textresponse">' + avitextresponse + '</div></div>';
		} else {
			avichatwindow.innerHTML += '<div class="avi-response"><div class="avi-textresponse">' + avitextresponse + '</div></div>';		
		}
	},
	
	clearavichatwindow: function(){
		avichatwindow.innerHTML = '';
		speechSynthesis.pause();
		speechSynthesis.cancel();
	}
	
}