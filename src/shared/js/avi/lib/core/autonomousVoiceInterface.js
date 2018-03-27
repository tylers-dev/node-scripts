avi.prototype.init = function(instanceexists){
	if(document.getElementById("menubtn") !== null && document.getElementById("menubtn")!==undefined){
		document.getElementById("menubtn").addEventListener("touchend", accountCheck, true);
	}
	if(!instanceexists){
		console.log("Building new, nothing in storage")
		//AVI instance does not exist, create a new one
		//Build the subject and topic objects for the aviInstance
		for(var j=0; j<subjects.length; j++){
			var thetopicsinthissubject = subjects[j].topicsinsubject.split(",");
			aviInstance.AVIsubjects[subjects[j].name] = avi.prototype.subjectFactory(subjects[j]);
		}
	} else {
		//Found an instance in storage (local or session), now check it's aviImplemenationDate prop to see if it matches what is currently defined in the aviOptions.aviImplemenationDate. 
		//If the dates don't match, build a new AVI object
		//If they match, create a new object and copy the props from the object in storage 
		var priorAVIInstance = JSON.parse(sessionStorage.getItem("avi-instance"));
		this.consoleDir(priorAVIInstance)
		if(priorAVIInstance.aviImplemenationDate !== aviOptions.aviImplemenationDate){ //Build new object with fresh props
			console.log("Found in storage, but implementation dates don't match.  Creating new.")
			for(var j=0; j<subjects.length; j++){
				var thetopicsinthissubject = subjects[j].topicsinsubject.split(",");
				aviInstance.AVIsubjects[subjects[j].name] = avi.prototype.subjectFactory(subjects[j]);
			}
		} else { //Create new object and copy props
			console.log("Found in storage, reapplying properties.")
			for (var prop in priorAVIInstance) {
				if (priorAVIInstance.hasOwnProperty(prop)) {
					aviInstance[prop] = priorAVIInstance[prop];
				}
			}
		}
	}
	
	//Now that the aviInstance object is created in memory, load the developer defined actions and check to see which topics in which subjects have defined functions
	var loadActions = [
		'topics/autonomousVoiceActions:avi.prototype.addBeforeAndAfterTopicFunctions()'
	]
	loadJSInMemory(loadActions);

	console.dir(aviInstance)
	sessionStorage.setItem("avi-instance", JSON.stringify(aviInstance))
	
	
	//Check to see the AVI is open from another page and re-open on this page, adding the classname "avilight"
	//Iterate over the complete object, finding the last subject/topic marked as current.
	//Find the next topic, assigning it a varible so that it can be used for the demo button 
	//Then, add the continue demo button with the askAVI function targeting the next topic
	if(sessionStorage.getItem("avi-open") === "true"){
		for(var thesubjects in aviInstance.AVIsubjects){
			if(aviInstance.AVIsubjects[thesubjects].currentsubject ===true){
				var currentSubject =  aviInstance.AVIsubjects[thesubjects].name;
				for(var thetopics in aviInstance.AVIsubjects[currentSubject].topicsinsubject){
					if(aviInstance.AVIsubjects[currentSubject].topicsinsubject[thetopics].currenttopic ===true){
						var nextTopic = aviInstance.AVIsubjects[currentSubject].topicsinsubject[thetopics].nextTopic;
					}
				}
			}
		}
		closeAllPops();
		setTimeout(function(){
			var aviresponsediv = document.createElement("div"), avicontinuebutton = document.createElement("div");
			aviresponsediv.className = "avi-response";
			avicontinuebutton.className = "avi-button";
			avicontinuebutton.id = "avicontinuebutton";
			avicontinuebutton.innerHTML = "Continue Demo"
			avicontinuebutton.setAttribute("ontouchend", "avi.prototype.askAVI('"+ currentSubject + "', '" + nextTopic + "')");
			aviresponsediv.appendChild(avicontinuebutton);
			document.getElementById("avichatwindow").appendChild(aviresponsediv);
			
			//document.getElementById("avichatwindow").innerHTML = '<div class="avi-response"><div id="avicontinuebutton" class="avi-button" ontouchend="avi.prototype.askAVI(\''+ currentSubject + '\', \''+ nextTopic + '\')">Continue Demo</div></div>';
			document.getElementById("avi").classList.add("avilight");
			document.getElementById("avi").classList.add("dominant");
			document.getElementById("avi").setAttribute("popBg", "0");
			closeAllPops();
		}, 100);
		setTimeout(function(){
			popupToggle("avi");
		}, 1000);
	}
	
	avi.prototype.buildAVISubjectMenu();
	addAVIButton();
	accountCheck();
	if(document.getElementById("pagecontenttransition")!==undefined &&document.getElementById("pagecontenttransition")!==null){
		document.getElementById("pagecontenttransition").addEventListener("click",  avi.prototype.checkQuizAnswer, true);
	}
	
	
	var newtopicsleft = 0;
	for(var thesubjects in aviInstance.AVIsubjects){
		if(aviInstance.AVIsubjects[thesubjects].status =="new"){
			if(aviInstance.AVIsubjects[thesubjects].usercompletedsubject !==true){
				newtopicsleft++
			}
		}
	}
	
	if(newtopicsleft > 0){
		var newTopicsMenuNotification = document.createElement("div");
			newTopicsMenuNotification.className = "avinotification";
			newTopicsMenuNotification.id = "avinotification";
			newTopicsMenuNotification.innerHTML = newtopicsleft;
			var menubutton = document.getElementById("menubtn");
			if(menubutton!==undefined && menubutton!==null){
				menubutton.parentNode.insertBefore(newTopicsMenuNotification, menubutton);
			}
	}
}

avi.prototype.subjectFactory = function(subject){
	var subjectObject = new Object();
	subjectObject = {
		name: subject.name,
		menutext: subject.menutext,
		trackingvalue: subject.trackingvalue,
		userresponsetext: subject.userresponsetext,
		status: subject.status ? subject.status : "",
		topicsinsubject:{}
	  };
	var thetopicsinthissubject = subject.topicsinsubject.split(",");
	var activityObjectName, activityNextTopic, activityObjectActivityType, activityObjectActivityUserResponse, activityObjectActivityAVIResponseText, activityObjectActivityAVIResponseVoice;
	for(var k=0; k<thetopicsinthissubject.length; k++){
		for(var l=0; l<topics.length; l++){
			if(thetopicsinthissubject[k] ===topics[l].name){
				if((k + 1) == (thetopicsinthissubject.length)){
					activityNextTopic = "ENDOFSUBJECT";
				} else {
					activityNextTopic = thetopicsinthissubject[k + 1];
				}
				subjectObject.topicsinsubject[topics[l].name] = avi.prototype.activityFactory(k, topics[l], activityNextTopic, subject);

			}
					
		}
	}
	
	
	return subjectObject;
}

//avi.prototype.activityFactory = function(order, activityObjectName, activityNextTopic, activityObjectActivityType, activityObjectActivityUserResponse, activityObjectActivityAVIResponseText, activityObjectActivityAVIResponseVoice){
avi.prototype.activityFactory = function(order, topic, activityNextTopic, subject){
	var activityObject = new Object();
	
	activityObject = {
		order: order,
		name: topic.name,
		nextTopic: activityNextTopic,
		type: topic.activity[0].type,
		trackingvalue: topic.activity[0].trackingvalue,
		userresponse: topic.activity[0].activityuserresponse ? topic.activity[0].activityuserresponse : "",
		aviresponsetext: topic.activity[0].activityaviresponse[0].text ? topic.activity[0].activityaviresponse[0].text : "",
		aviresponsevoice:topic.activity[0].activityaviresponse[0].voice ? topic.activity[0].activityaviresponse[0].voice : "",
		firstbuttontext:topic.activity[0].activityaviresponse[0].firstbuttontext ? topic.activity[0].activityaviresponse[0].firstbuttontext : "",
		firstbuttonfunction:topic.activity[0].activityaviresponse[0].firstbuttonfunction ? topic.activity[0].activityaviresponse[0].firstbuttonfunction : 'aviInstance.AVIsubjects[\''+ subject.name +'\'].topicsinsubject[\''+ topic.name +'\'].afterFunction(\''+ subject.name+'\', aviInstance.AVIsubjects[\''+subject.name+'\'].topicsinsubject[\''+topic.name+'\'].nextTopic)',
		secondbuttontext:topic.activity[0].activityaviresponse[0].secondbuttontext ? topic.activity[0].activityaviresponse[0].secondbuttontext : "",
		secondbuttonfunction:topic.activity[0].activityaviresponse[0].secondbuttonfunction ? topic.activity[0].activityaviresponse[0].secondbuttonfunction : 'aviInstance.AVIsubjects[\''+ subject.name +'\'].topicsinsubject[\''+ topic.name +'\'].afterFunction(\''+ subject.name+'\', aviInstance.AVIsubjects[\''+subject.name+'\'].topicsinsubject[\''+topic.name+'\'].nextTopic)',
		correctelement: topic.activity[0].activityaviresponse[0].correctelement ? topic.activity[0].activityaviresponse[0].correctelement : "",
		correctansweravitextresponse: topic.activity[0].activityaviresponse[0].correctansweravitextresponse ? topic.activity[0].activityaviresponse[0].correctansweravitextresponse : "",
		correctansweravivoiceresponse: topic.activity[0].activityaviresponse[0].correctansweravivoiceresponse ? topic.activity[0].activityaviresponse[0].correctansweravivoiceresponse : "",
		wrongansweravitextresponse: topic.activity[0].activityaviresponse[0].wrongansweravitextresponse ? topic.activity[0].activityaviresponse[0].wrongansweravitextresponse : "",
		wrongansweravivoiceresponse: topic.activity[0].activityaviresponse[0].wrongansweravivoiceresponse ? topic.activity[0].activityaviresponse[0].wrongansweravivoiceresponse : ""
	  };
	
	return activityObject;
}

avi.prototype.addBeforeAndAfterTopicFunctions = function(){
	for(var j=0; j<subjects.length; j++){
		var thetopicsinthissubject = subjects[j].topicsinsubject.split(",");
		for(var k=0; k<thetopicsinthissubject.length; k++){
			for(var l=0; l<topics.length; l++){
				if(thetopicsinthissubject[k] === topics[l].name){
					var activityObjectName = topics[l].name;
				}
			}
			
			//Check to see if the beforeTopic function exists, if not add a default one and print out the bootstrap function to the console
			if(typeof aviInstance.AVIsubjects[subjects[j].name].topicsinsubject[activityObjectName].beforeFunction !='function'){
				aviInstance.AVIsubjects[subjects[j].name].topicsinsubject[activityObjectName].beforeFunction = function(){
						console.log("BEFORE method for this topic was added automatically")	
				}
				var consolebootstrapbeforefunction = 'aviInstance.AVIsubjects["' +subjects[j].name + '"].topicsinsubject["' + activityObjectName + '"].beforeFunction = function(){\n' +
					'\t//beforeFunction for:\n' +
					'\t//Subject:  ' + subjects[j].name  + '\n' +
					'\t//Topic:  ' + activityObjectName  + '\n' +
					'\t//insert your code for things you want to happen BEFORE the AVI speaks here.\n' +
				'}';
							
				this.consoleLog("%cBootStrap BEFORE function for Topic:  " + activityObjectName + " in Subject:  " + subjects[j].name, "color: white; font-weight: bold; background-color: blue;padding: 2px")
				this.consoleLog(consolebootstrapbeforefunction)
			} else {
				this.consoleLog("%cDeveloper defined BEFORE function found for:  " +activityObjectName + " in Subject:  " + subjects[j].name, "color: white; font-weight: bold; background-color: green;padding: 2px")
			}
			      
			
			if(typeof aviInstance.AVIsubjects[subjects[j].name].topicsinsubject[activityObjectName].afterFunction !='function'){
				aviInstance.AVIsubjects[subjects[j].name].topicsinsubject[activityObjectName].afterFunction = function(subjectname, nextTopic){
					console.log("AFTER method for this topic was added automatically")
					aviInstance.askAVI(subjectname, nextTopic);
				}
				
				var consolebootstrapafterfunction = 'aviInstance.AVIsubjects["' +subjects[j].name + '"].topicsinsubject["' + activityObjectName + '"].afterFunction = function(subjectname, nextTopic){\n' +
					'\t//afterFunction for:\n' +
					'\t//Subject:  ' + subjects[j].name  + '\n' +
					'\t//Topic:  ' + activityObjectName  + '\n' +
					'\t//Insert your code for things you have to happen AFTER the AVI speaks here\n' + 
					'\t//You don\'t have to keep the next function call to the askAVI method within this function, but you will need to call it in a subsequent function, passing through the subjectname and nextTopic variables\n' + 
					'\t//If you want a pause after any actions you add to this function and when the AVI starts the next topic, just wrap the below function in a setTimeout\n' + 
					'\taviInstance.askAVI(subjectname, nextTopic);\n' + 
				'}';
				
				this.consoleLog("%cBootStrap AFTER function for Topic:  " + activityObjectName + " in Subject:  " + subjects[j].name, "color: white; font-weight: bold; background-color: blue;padding: 2px")
				this.consoleLog(consolebootstrapafterfunction)
			}	else {
				this.consoleLog("%cDeveloper defined AFTER function found for:  " +activityObjectName + " in Subject:  " + subjects[j].name, "color: white; font-weight: bold; background-color: green;padding: 2px")
			}
			
		}
	}
}

avi.prototype.openAVI = function(){
	popupToggle('avi');
	accountCheck();
	var firstAVISession = sessionStorage.getItem("avi-firstsession"), aviusername = sessionStorage.getItem("avi-username") ===null ? "Anna" : sessionStorage.getItem("avi-username");
	if(firstAVISession === null || firstAVISession === '' || firstAVISession === undefined){
		var coldopentext = 'Hi, ' + aviusername +', great news! The efficacy tile now features Kaplan-Meier survival curves and new functionality.<br /><br />It should take you about 15 minutes to review.<br /><br />Tap now on "New Efficacy Tile" located within the right-hand side menu and let\'s get started!';
		var coldopenvoice = 'Hi, ' + aviusername +', great news! The efficacy tile now features Kaplan-Meier survival curves and new functionality. It should take you about 15 minutes to review. Tap now on "New Efficacy Tile" located within the right-hand side menu and let\'s get started!';
		sessionStorage.setItem("avi-firstsession", false)
	} else {
		var coldopentext = 'Hi ' + aviusername +', how can I help?';
		var coldopenvoice = 'Hi ' + aviusername +', how can I help?';
	}
	avi.prototype.speakAVI(null, "OpenAVI", coldopentext, coldopenvoice);
}


avi.prototype.buildAVISubjectMenu = function(){
	while(document.getElementById("avisubjectlist").firstChild){
    	document.getElementById("avisubjectlist").removeChild(document.getElementById("avisubjectlist").firstChild);
	}
	//avisubjectlist.innerHTML = '';
	for(var key in aviInstance.AVIsubjects){
		for(var thetopics in aviInstance.AVIsubjects[key].topicsinsubject){
			if(aviInstance.AVIsubjects[key].topicsinsubject[thetopics].order ===0){
				var firsttopic = aviInstance.AVIsubjects[key].topicsinsubject[thetopics].name;
				var userCompleted = aviInstance.AVIsubjects[key]["usercompletedsubject"] === true ? "usercompleted " : ""
			}
		}
		var newSubjectDiv = document.createElement("div");
		newSubjectDiv.className = userCompleted +'avi-subject ' + aviInstance.AVIsubjects[key].name;
		newSubjectDiv.setAttribute("ontouchend", "avi.prototype.askAVITopic('"+ aviInstance.AVIsubjects[key].name  +"', '"+  firsttopic +"')");
		newSubjectDiv.innerHTML = aviInstance.AVIsubjects[key].menutext;
		document.getElementById("avisubjectlist").appendChild(newSubjectDiv)
		
		//avisubjectlist.innerHTML += '<div class="'+ userCompleted +'avi-subject ' + aviInstance.AVIsubjects[key].name + '" ontouchend="avi.prototype.askAVITopic(\''+ aviInstance.AVIsubjects[key].name  +'\', \''+  firsttopic +'\')">' + aviInstance.AVIsubjects[key].menutext + '</div>'; 
	}
}

avi.prototype.askAVITopic = function(subject, topic){
	if(!speechSynthesis.speaking){	
		while(document.getElementById("avichatwindow").firstChild){
			document.getElementById("avichatwindow").removeChild(document.getElementById("avichatwindow").firstChild);
		}
		//document.getElementById("avichatwindow").innerHTML = '';
		var userResponse = document.createElement("div");
		userResponse.className = "user-response";
		userResponse.innerHTML = aviInstance.AVIsubjects[subject].userresponsetext;
		document.getElementById("avichatwindow").appendChild(userResponse);
		
		//document.getElementById("avichatwindow").innerHTML += '<div class="user-response">' +aviInstance.AVIsubjects[subject].userresponsetext+ '</div>';
		this.askAVI(subject, topic)
		aviClient.track("Started Subject:  " + aviInstance.AVIsubjects[subject].trackingvalue);
	}
}

avi.prototype.askAVI = function(subject, topic){
	if(accountPresent){
		//avi.prototype.speakAVI(null, "OpenAVI", "I see you have selected an account.  Please end the call and reopen the ISA from the media tab.", "I see you have selected an account.  Please end the call and re-open the I S A from the media tab.")	;
		//popupToggle("avi");
		this.resetAVI();
		setTimeout(function(){
			com.veeva.clm.gotoSlide("Standalone-GluVivaKinesis-home.zip", "StandaloneGluVivaKinesisSummitExample")
		}, 500)
	}
	if(!cancelAVI && !accountPresent){
		//console.log("Subject passed:  "+ subject)
		//console.log("Topic passed:  "+ topic)
		
		var usertextresponse = '', avitextresponse = '', avivoiceresponse = '';
		if(topic !== 'ENDOFSUBJECT' && topic !== undefined){
			aviInstance.AVIsubjects[subject].topicsinsubject[topic].beforeFunction();
			aviInstance.AVIsubjects[subject]["currentsubject"] = true;
			if(aviInstance.AVIsubjects[subject].topicsinsubject[topic].userresponse !== "" && aviInstance.AVIsubjects[subject].topicsinsubject[topic].userresponse!== undefined && !speechSynthesis.speaking){
				var userResonsediv = document.createElement("div");
				userResonsediv.className = "user-response";
				userResonsediv.innerHTML = aviInstance.AVIsubjects[subject].topicsinsubject[topic].userresponse
				document.getElementById("avichatwindow").appendChild(userResonsediv);
				//document.getElementById("avichatwindow").innerHTML += '<div class="user-response">' + aviInstance.AVIsubjects[subject].topicsinsubject[topic].userresponse + '</div>';
			}
			setTimeout(function(){
				avi.prototype.speakAVI(subject, topic, aviInstance.AVIsubjects[subject].topicsinsubject[topic].aviresponsetext, aviInstance.AVIsubjects[subject].topicsinsubject[topic].aviresponsevoice);
			}, 500);
		} else {
			console.log("adding user completed subject")
			aviInstance.AVIsubjects[subject]["usercompletedsubject"] = true;
			this.removeCurrentSubjectTopic();	
		}
		sessionStorage.setItem("avi-instance", JSON.stringify(aviInstance));
	}
	
	if(!attachedResetToElements){
		if(document.getElementById("avi_btn") !==undefined && document.getElementById("avi_btn") !==null){
			document.getElementById("avi_btn").addEventListener("touchend", avi.prototype.resetAVI);
			attachedResetToElements = true;
			console.log("added event listener to button")
		} else {
			attachedResetToElements = false;		
		}
		/*if(document.getElementById("avi_bg") !==undefined && document.getElementById("avi_bg") !==null){
			document.getElementById("avi_bg").addEventListener("touchend", avi.prototype.resetAVI);
			attachedResetToElements = true;
			console.log("added event listener to background")
		} else {
			attachedResetToElements = false;		
		}	*/
	}
}

avi.prototype.speakAVI = function(subject, topic, avitextresponse, avivoiceresponse){
	this.voices = voices;
	if(topic!=="OpenAVI"){
		for(var thetopics in aviInstance.AVIsubjects[subject].topicsinsubject){
			if(aviInstance.AVIsubjects[subject].topicsinsubject[thetopics].currenttopic ===true){
				delete aviInstance.AVIsubjects[subject].topicsinsubject[thetopics]["currenttopic"]
			}
		}
		aviInstance.AVIsubjects[subject].topicsinsubject[topic]["currenttopic"] = true;
		sessionStorage.setItem("avi-instance", JSON.stringify(aviInstance))
		if(aviInstance.AVIsubjects[subject].topicsinsubject[topic].type ==="response"){
			var responseDiv = document.createElement("div"), responseDivbutton1 = document.createElement("div"), responseDivbutton2 = document.createElement("div"), ordiv = document.createElement("div");
			responseDiv.className = "avi-response buttons";
			ordiv.innerHTML = "<br />or<br />";
			responseDivbutton1.className = "avi-button";
			responseDivbutton1.setAttribute("ontouchend", aviInstance.AVIsubjects[subject].topicsinsubject[topic].firstbuttonfunction)
			responseDivbutton1.innerHTML = aviInstance.AVIsubjects[subject].topicsinsubject[topic].firstbuttontext;
			
			responseDivbutton2.className = "avi-button";
			responseDivbutton2.setAttribute("ontouchend", aviInstance.AVIsubjects[subject].topicsinsubject[topic].secondbuttonfunction);
			responseDivbutton2.innerHTML = aviInstance.AVIsubjects[subject].topicsinsubject[topic].secondbuttontext;
			
			responseDiv.appendChild(responseDivbutton1);
			responseDiv.appendChild(ordiv);
			responseDiv.appendChild(responseDivbutton2);
			document.getElementById("avichatwindow").appendChild(responseDiv);
			
			//document.getElementById("avichatwindow").innerHTML += '<div class="avi-response buttons"><div class="avi-button" ontouchend="'+ aviInstance.AVIsubjects[subject].topicsinsubject[topic].firstbuttonfunction +'">' + aviInstance.AVIsubjects[subject].topicsinsubject[topic].firstbuttontext + '</div><br />or<br /><div class="avi-button" ontouchend="'+ aviInstance.AVIsubjects[subject].topicsinsubject[topic].secondbuttonfunction +'">'+ aviInstance.AVIsubjects[subject].topicsinsubject[topic].secondbuttontext  +'</div></div>';
			return	
		}
		if(aviInstance.AVIsubjects[subject].topicsinsubject[topic].type ==="quiz"){
			//Attach a click handler to the page for checking the answer, passing the id for element with the ID that is defined as the correct answer
			//document.getElementById("pagecontenttransition").addEventListener("click",  avi.prototype.checkQuizAnswer, true)
			/*for(var thesubjects in aviInstance.AVIsubjects){
				if(aviInstance.AVIsubjects[thesubjects].currentsubject ===true){
					checkAnswerSubject =  aviInstance.AVIsubjects[thesubjects].name;
					for(var thetopics in aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject){
						if(aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[thetopics].currenttopic ===true){
							checkAnswerTopic = aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[thetopics].name;
						}
					}
				}
			}*/
			checkAnswerSubject = subject;
			checkAnswerTopic = topic;
			checkAnswerFunctionEnabled = true;
		}
	}
	window.utterances = [];
	var utterance = new SpeechSynthesisUtterance(avivoiceresponse);
	if(aviInstance.environment!=="iPad"){
		utterance.voice = this.voices[20];
		utterance.lang = this.voices[20].lang;
	}
	utterances.push( utterance );
	if(!speechSynthesis.speaking){
		this.avichatwindow(avitextresponse);
	}
	utterance.onend = function(e) {
		if(topic!=="OpenAVI" && nextTopic!=="ENDOFSUBJECT" && aviInstance.AVIsubjects[subject].topicsinsubject[topic].type !=="quiz"){
			accountCheck();
			aviInstance.AVIsubjects[subject].topicsinsubject[topic].afterFunction(subject, aviInstance.AVIsubjects[subject].topicsinsubject[topic].nextTopic);
		}
		try {
			aviClient.track("Started Topic:  " + aviInstance.AVIsubjects[subject].topicsinsubject[topic].trackingvalue + ", in Subject:  " + aviInstance.AVIsubjects[subject].trackingvalue);
			aviInstance.AVIsubjects[subject].topicsinsubject[topic]["usercompletedtopic"] = true;
		} catch (err) {
			console.log(err)
		}
	}
	
	if(!speechSynthesis.speaking){							
		speechSynthesis.speak( utterance );
	} else {
		console.log("Speaking")	
	}
	utterance.onerror = function(e) {
		console.log("Voice error:");
		console.dir(e);
	}
}

avi.prototype.checkQuizAnswer = function(event){
	if(checkAnswerFunctionEnabled && !speechSynthesis.speaking){
		console.log("firing check answer")
		if(event.target.id !== null && event.target.id !== undefined && event.target.id ===aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[checkAnswerTopic].correctelement){
			avi.prototype.askAVI(checkAnswerSubject, aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[checkAnswerTopic].nextTopic);
			//document.getElementById("pagecontenttransition").removeEventListener("click",  avi.prototype.checkQuizAnswer, true);
			checkAnswerFunctionEnabled = false
		} else {
			if(aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[checkAnswerTopic].wrongansweravitextresponse !=="" && aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[checkAnswerTopic].wrongansweravivoiceresponse!==""){
			avi.prototype.speakAVI(checkAnswerSubject, checkAnswerTopic, aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[checkAnswerTopic].wrongansweravitextresponse, aviInstance.AVIsubjects[checkAnswerSubject].topicsinsubject[checkAnswerTopic].wrongansweravivoiceresponse);	
			}
		}
	}
}

avi.prototype.avichatwindow = function(avitextresponse){
	var aviResponseDiv = document.createElement("div"), aviTextResponseDiv = document.createElement("div");
	aviResponseDiv.className = "avi-response";
	aviTextResponseDiv.className = "avi-textresponse";
	aviTextResponseDiv.innerHTML = avitextresponse;
	aviResponseDiv.appendChild(aviTextResponseDiv);
	
	if(document.getElementById("avi").classList.contains("avilight")){
		while(document.getElementById("avichatwindow").firstChild){
    		document.getElementById("avichatwindow").removeChild(document.getElementById("avichatwindow").firstChild);
		}
		//document.getElementById("avichatwindow").innerHTML = '';
		//document.getElementById("avichatwindow").innerHTML = '<div class="avi-response"><div class="avi-textresponse">' + avitextresponse + '</div></div>';
	} 
	document.getElementById("avichatwindow").appendChild(aviResponseDiv)
}


avi.prototype.clearavichatwindow = function(){
	//document.getElementById("avichatwindow").innerHTML = '';
	while(document.getElementById("avichatwindow").firstChild){
    	document.getElementById("avichatwindow").removeChild(document.getElementById("avichatwindow").firstChild);
	}
	speechSynthesis.pause();
	speechSynthesis.cancel();
}
	
avi.prototype.activateTouchpoint = function(x, y){
	document.getElementById("touchpoint").style.top = x + "px";
	document.getElementById("touchpoint").style.left = y + "px";
	document.getElementById("touchpoint").classList.add("active");
	setTimeout(function(){
		document.getElementById("touchpoint").classList.remove("active");
	}, 500)
}
	
avi.prototype.activateTouchpointWithSwipe = function(x, y, moveX, moveY){
	document.getElementById("touchpoint").style.top = x + "px";
	document.getElementById("touchpoint").style.left = y + "px";
	document.getElementById("touchpoint").classList.add("active");
	setTimeout(function(){
		document.getElementById("touchpoint").style.transform = "matrix(1, 0, 0, 1, "+ moveX  +", " + moveY +")";
	}, 1000);
	setTimeout(function(){
		document.getElementById("touchpoint").style.display = "none";
	}, 1750);
	setTimeout(function(){
		document.getElementById("touchpoint").classList.remove("active");
		document.getElementById("touchpoint").style.transform ="";
		document.getElementById("touchpoint").style.display = "";
	}, 2000);
}
			
avi.prototype.moveAVI = function(x, y){
	document.getElementById("avi").style.top = x + "px";
	document.getElementById("avi").style.left = y + "px";
}

avi.prototype.consoleLog = function(logmessage, style){
	if(aviInstance !=="iPad"){
		if(style){
			console.log(logmessage, style)
		} else {
			console.log(logmessage)
		}
	}
}

avi.prototype.consoleDir = function(logmessage){
	if(aviInstance !=="iPad"){
		console.dir(logmessage)
	}
}

avi.prototype.resetAVI = function(){
	closeThisPop("avi")
	sessionStorage.setItem("avi-open", "false");
	cancelAVI = true;
	aviInstance.removeCurrentSubjectTopic();
	speechSynthesis.pause();
	speechSynthesis.cancel();
	setTimeout(function(){
		//document.getElementById("avichatwindow").innerHTML=''; 
		while(document.getElementById("avichatwindow").firstChild){
    		document.getElementById("avichatwindow").removeChild(document.getElementById("avichatwindow").firstChild);
		}
		document.getElementById("avi").classList.remove('avilight', 'dominant');
	}, 1000)
}

avi.prototype.setVarsOnOpen = function(){
	cancelAVI = false;
	sessionStorage.setItem("avi-open", "true");	
}

avi.prototype.removeCurrentSubjectTopic = function(){
	for(var thesubjects in aviInstance.AVIsubjects){
		if(aviInstance.AVIsubjects[thesubjects].currentsubject ===true){
			var currentSubject =  aviInstance.AVIsubjects[thesubjects].name;
			delete aviInstance.AVIsubjects[thesubjects]["currentsubject"];
			for(var thetopics in aviInstance.AVIsubjects[currentSubject].topicsinsubject){
				if(aviInstance.AVIsubjects[currentSubject].topicsinsubject[thetopics].currenttopic ===true){
					delete aviInstance.AVIsubjects[currentSubject].topicsinsubject[thetopics]["currenttopic"];
				}
			}
		}
	}
	sessionStorage.setItem("avi-instance", JSON.stringify(aviInstance))	
}

avi.prototype.returnOptions = function(option){
	return this[option]
}

avi.prototype.exitAVI = function(){
	popupToggle("avi");
	this.resetAVI();	
}
