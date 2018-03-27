aviInstance.AVIsubjects["avidemo"].topicsinsubject["avistarttraining"].afterFunction = function(subjectname, nextTopic){
	closeAllPops();
	kinesisBuilder.closeCustomLayoutSingle()
	setTimeout(function(){
		com.veeva.clm.gotoSlide('Standalone-GluVivaKinesis-patientprofiles.zip', 'StandaloneGluVivaKinesisSummitExample');
		//document.location = "/Standalone-GluVivaKinesis-patientprofiles/index.html"
	}, 750)
	//aviInstance.askAVI(subjectname, nextTopic);
}


aviInstance.AVIsubjects["avidemo"].topicsinsubject["buttonclick"].afterFunction = function(subjectname, nextTopic){
	document.getElementById("avi").classList.remove("dominant");
	tapAreaForJason()
	setTimeout(function(){
		aviInstance.askAVI(subjectname, nextTopic);
	}, 750)
}

aviInstance.AVIsubjects["avidemo"].topicsinsubject["pagescroll"].afterFunction = function(subjectname, nextTopic){
	document.getElementById("avi").classList.remove("dominant");
	slidePageTo(-1370) 
	setTimeout(function(){
		aviInstance.askAVI(subjectname, nextTopic);
	}, 750)
}

aviInstance.AVIsubjects["avidemo"].topicsinsubject["toggleISI"].beforeFunction = function(){
	document.getElementById("avi").classList.remove("dominant");
}


aviInstance.AVIsubjects["avidemo"].topicsinsubject["toggleISI"].afterFunction = function(subjectname, nextTopic){
	closeThisPop("avi");
	setTimeout(function(){
		popupToggle("isi")
	}, 1000)
	setTimeout(function(){
		document.getElementById("avi").classList.remove("avilight");
	}, 1200)
	setTimeout(function(){
		popupToggle('avi');
	}, 2000)
	setTimeout(function(){
		aviInstance.askAVI(subjectname, nextTopic);
	}, 2500)
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivannavigatetotile"].afterFunction = function(subjectname, nextTopic){
	setTimeout(function(){
		com.veeva.clm.gotoSlide('Standalone-GluVivaKinesis-aviquiz.zip', 'StandaloneGluVivaKinesisSummitExample');
		//document.location = "/Standalone-GluVivaKinesis-aviquiz/index.html"
	}, 750)
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanopeningremarks"].afterFunction = function(subjectname, nextTopic){
	aviInstance.moveAVI(75, 50)
	aviInstance.askAVI(subjectname, nextTopic);
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanactionsoverview"].beforeFunction = function(){
	aviInstance.activateTouchpoint(175, 235);
	aviInstance.moveAVI(75, 215)
	swapTabs("tab2", "tabbutton2");
	setTimeout(function(){
		aviInstance.activateTouchpoint(220, 135)
		popupToggle('dropdown1')
	}, 1000);
	setTimeout(function(){
		changeContent('gender', 'Male', 'dropdown1')
	}, 2000);
	setTimeout(function(){
		aviInstance.activateTouchpoint(220, 245)
		popupToggle('dropdown2')
	}, 3000);
	setTimeout(function(){
		changeContent('pdl1', '≥ 5%', 'dropdown2')
	}, 4000);
	setTimeout(function(){
		aviInstance.activateTouchpoint(220, 355)
		popupToggle('dropdown3')
	}, 5000);
	setTimeout(function(){
		changeContent('neversmoker', 'Never smoker', 'dropdown3')
	}, 6000);
	setTimeout(function(){
		aviInstance.activateTouchpoint(220, 465)
		popupToggle('dropdown4')
	}, 7000);
	setTimeout(function(){
		changeContent('oneprior', 'One prior', 'dropdown4')
	}, 8000);
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanactionsoverview"].afterFunction = function(subjectname, nextTopic){
	setTimeout(function(){
		aviInstance.activateTouchpoint(175, 390);
		aviInstance.moveAVI(75, 370)
		swapTabs("tab3", "tabbutton3")
		aviInstance.askAVI(subjectname, nextTopic);
	}, 3000)
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanemailfollowup"].beforeFunction = function(){
	setTimeout(function(){
		aviInstance.moveAVI(350, 449)
		setTimeout(function(){
			popupToggle('sidebarmask')
		}, 2000)
		setTimeout(function(){
			aviInstance.activateTouchpoint(240, 975)
			checkmark1.classList.add("checked")
			document.getElementById("sendemail").classList.add("active");
		}, 5000)
		setTimeout(function(){
			aviInstance.activateTouchpoint(390, 975)
			checkmark2.classList.add("checked")
		}, 6000)
		setTimeout(function(){
			aviInstance.activateTouchpoint(540, 975)
			checkmark3.classList.add("checked")
		}, 7000)
		setTimeout(function(){
			aviInstance.activateTouchpoint(690, 975)
			checkmark4.classList.add("checked")
		}, 8000)
		setTimeout(function(){
			aviInstance.activateTouchpoint(738, 925)
		}, 8750)
		setTimeout(function(){
			closeThisPop("sidebarmask")
			document.getElementById("avi").classList.remove("avilight", "dominant");
			aviInstance.moveAVI(52, 2);
			//popupToggle('avi');
		}, 9500)
	}, 1000)
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanemailfollowup"].afterFunction = function(subjectname, nextTopic){
	setTimeout(function(){
		aviInstance.clearavichatwindow();
		aviInstance.askAVI(subjectname, nextTopic);
		checkmark1.classList.remove("checked");
		checkmark2.classList.remove("checked");
		checkmark3.classList.remove("checked");
		checkmark4.classList.remove("checked");
		document.getElementById("sendemail").classList.remove("active");
	}, 1000);
}


aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanwhichobjectiontostartwith"].beforeFunction = function(){
	aviInstance.clearavichatwindow();
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanobjection2"].beforeFunction = function(){
	aviInstance.clearavichatwindow();
	document.getElementById("avi").classList.add("avilight");
	document.getElementById("avi").classList.add("dominant");
	aviInstance.moveAVI(350, 449)
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanwelldone"].afterFunction = function(subjectname, nextTopic){
	document.getElementById("avi").classList.remove("avilight", "dominant"); 
	aviInstance.moveAVI(52, 2);
	aviInstance.askAVI(subjectname, nextTopic);
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanpracticeemailquiz"].beforeFunction = function(){
	aviInstance.clearavichatwindow();
	document.getElementById("avi").classList.add("avilight");
	document.getElementById("avi").classList.add("dominant");
	aviInstance.moveAVI(50, 20)
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanshowontheroad"].afterFunction = function(subjectname, nextTopic){
	document.getElementById("avi").classList.remove("avilight", "dominant");
	aviInstance.moveAVI(52, 2);
	aviInstance.askAVI(subjectname, nextTopic);
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanrating"].beforeFunction = function(){
	aviInstance.clearavichatwindow();
}

aviInstance.AVIsubjects["apdivan"].topicsinsubject["apdivanrating"].afterFunction = function(subjectname, nextTopic){
	aviInstance.askAVI(subjectname, nextTopic);
	setTimeout(function(){
		aviInstance.resetAVI();
	}, 500);
	setTimeout(function(){
		popupToggle("rating");
	}, 1500);
}

aviInstance.AVIsubjects["aviobjectionhandlers"].topicsinsubject["apdivannavigatetotile"].afterFunction = function(subjectname, nextTopic){
	setTimeout(function(){
		com.veeva.clm.gotoSlide('Standalone-GluVivaKinesis-aviquiz.zip', 'StandaloneGluVivaKinesisSummitExample');
		//document.location = "/Standalone-GluVivaKinesis-aviquiz/index.html"
	}, 750)
}

aviInstance.AVIsubjects["aviobjectionhandlers"].topicsinsubject["apdivanwhichobjectiontostartwith"].afterFunction = function(subjectname, nextTopic){
	document.getElementById("avi").classList.remove("avilight", "dominant"); 
	aviInstance.askAVI(subjectname, nextTopic);
}

aviInstance.AVIsubjects["aviobjectionhandlers"].topicsinsubject["apdivanwhichobjectiontostartwith"].beforeFunction = function(){
	aviInstance.clearavichatwindow();
}

aviInstance.AVIsubjects["aviobjectionhandlers"].topicsinsubject["apdivanobjection2"].beforeFunction = function(){
	aviInstance.clearavichatwindow();
	document.getElementById("avi").classList.add("avilight");
	document.getElementById("avi").classList.add("dominant");
	aviInstance.moveAVI(350, 449)
}

aviInstance.AVIsubjects["aviobjectionhandlers"].topicsinsubject["apdivanwelldone"].afterFunction = function(subjectname, nextTopic){
	document.getElementById("avi").classList.remove("avilight", "dominant"); 
	aviInstance.moveAVI(52, 2);
	aviInstance.askAVI(subjectname, nextTopic);
}

aviInstance.AVIsubjects["aviobjectionhandlers"].topicsinsubject["apdivanrating"].beforeFunction = function(){
	aviInstance.clearavichatwindow();
}

aviInstance.AVIsubjects["aviobjectionhandlers"].topicsinsubject["apdivanrating"].afterFunction = function(subjectname, nextTopic){
	aviInstance.askAVI(subjectname, nextTopic);
	setTimeout(function(){
		aviInstance.resetAVI();
	}, 500);
	setTimeout(function(){
		popupToggle("rating");
	}, 1500);
}