/************************************************************************

pharmaSwipe.js
Project Lead:
Intouch Solutions

************************************************************************/

var pharmaSwipe = {
	detectSwipeStart:function(event) {
  		pharmaSwipe.startX = event.touches[0].pageX;
  		pharmaSwipe.startY = event.touches[0].pageY
	},

	detectSwipe:function(event) {
		pharmaSwipe.x = event.touches[0].pageX;
		pharmaSwipe.y = event.touches[0].pageY;
		var curX = pharmaSwipe.x - pharmaSwipe.startX;
		var curY = pharmaSwipe.y - pharmaSwipe.startY;
		if(curX <= -20 && curX >= -40 && curY <= 20 && curY >= -20) {
			pharmaSwipe.swipeLeft();
			//console.log('swipeLeft');
		} else if(curX >= 20 && curX <= 40 && curY <= 20 && curY >= -20) {
			pharmaSwipe.swipeRight()
			//console.log('swipeRight');
		} else {
			return false
		}
  	},

	swipeLeft: function() {
		goNext()
	},

	swipeRight: function() {
		goPrev()
	}
};
pharmaSwipe.startX = "";
pharmaSwipe.startY = "";
pharmaSwipe.x = "";
pharmaSwipe.y = "";
document.addEventListener("touchstart", pharmaSwipe.detectSwipeStart, false);
document.addEventListener("touchmove", pharmaSwipe.detectSwipe, false);


//Get the path from the session storage object setup in the presentation builder
var path = [], pathsArray = [], currentSlide, nextSlide, prevSlide;

/*get chosen path*/
function getPath(){
	currentSlide = zipName + ", " + dsaId;
	if(sessionStorage.currentPath===undefined || sessionStorage.currentPath===null || sessionStorage.currentPath==='') {
		sessionStorage.setItem("currentPath", kinesisBuilder.lookUpSegmentInfo('tileOrder', segments[0].segment));
		sessionStorage.setItem("tileOrder", kinesisBuilder.lookUpSegmentInfo('tileOrder', segments[0].segment));
 	}
	path = sessionStorage.currentPath.split(",");
	for(i=0; i < path.length; i++) {
		var eachPath = kinesisBuilder.lookUpSlideInfo('contentLink', path[i]);
		pathsArray.push(eachPath);
	}
	nextSlide = pathsArray.indexOf(currentSlide) + 1;
	prevSlide = pathsArray.indexOf(currentSlide) - 1;
	if(pathsArray[nextSlide] ===undefined){
		rightnavigationalarrow.classList.add("hidden");
	}
	if(pathsArray[prevSlide] ===undefined){
		leftnavigationalarrow.classList.add("hidden");
	}
	buildSwimLane()
}


function buildSwimLane(){
	var swimlaneimage, swimlanelink, swimlaneclassname, indexofCurrentslide = pathsArray.indexOf(currentSlide), swimlanezippackage;
	for(i=0; i < path.length; i++) {
		if(i<indexofCurrentslide){
			swimlaneclassname = 'disabled';
		} else if (i==Number(indexofCurrentslide)){
			swimlaneclassname = 'selected';
		} else {
			swimlaneclassname = ''
		}
		swimlaneimage = kinesisBuilder.lookUpSlideInfo('image', path[i]);
		swimlanelink = kinesisBuilder.lookUpSlideInfo('contentLink', path[i]);
		swimlanezippackage = swimlanelink.split(",")[0];
		$('<li class="profile remotebtn '+swimlaneclassname+'" ontouchend="com.veeva.clm.gotoSlide(\''+ swimlanezippackage +'\', \'StandaloneGluVivaKinesisSummitExample\')"><img src="../shared/images/'+ swimlaneimage +'"></li>')
			.appendTo($(swimlaneUL))
	}
}


/* Slide next navigation function */
function goNext() {
	if(path==null){
		addClassAndJump("slideleft");
	} else if (pathsArray.indexOf(currentSlide) === -1){
		addClassAndJump("slideleft");
	} else {
		if(pathsArray[nextSlide] !=undefined){
			addClassAndJump("slideleft", true);
		} else {
			return "nogo";
		}
	}
}

/* Slide previous navigation function */
function goPrev() {
	if(path==null){
		addClassAndJump("slideright");
	} else if (pathsArray.indexOf(currentSlide) === -1){
		addClassAndJump("slideright");
	} else {
		if(pathsArray[prevSlide] !=undefined){
			addClassAndJump("slideright", true);
		} else {
			return "nogo";
		}
	}
};

function addClassAndJump(classname, inpath){
	//Remote response
	if(sockConnection) sock.send(JSON.stringify({ status: "button-pressed" }));
	//
	if(forcedISIImplemented !== null && forcedISIImplemented === true && userCanJump){
		if(classname === "slideleft") {
			console.log("here")
			pagecontenttransition.classList.add(classname);
			if(inpath){
				setTimeout(function(){
					com.veeva.clm.gotoSlide(pathsArray[nextSlide]);
				}, 250)
			} else {
				setTimeout(function(){
					com.veeva.clm.nextSlide();
				}, 250)
			}
		} else if(classname === "slideright") {
			pagecontenttransition.classList.add(classname);
			if(inpath){
				setTimeout(function(){
					com.veeva.clm.gotoSlide(pathsArray[prevSlide]);
				}, 250)
			} else {
				setTimeout(function(){
					com.veeva.clm.prevSlide();
				}, 250)
			}
		}
	} else if(userCanJump) {
		pagecontenttransition.classList.add(classname);
		if(classname === "slideleft") {
			if(inpath){
				setTimeout(function(){
					com.veeva.clm.gotoSlide(pathsArray[nextSlide]);
				}, 250)
			} else {
				setTimeout(function(){
					com.veeva.clm.nextSlide();
				}, 250)
			}
		} else if(classname === "slideright") {
			if(inpath){
				setTimeout(function(){
					com.veeva.clm.gotoSlide(pathsArray[prevSlide]);
				}, 250)
			} else {
				setTimeout(function(){
					com.veeva.clm.prevSlide();
				}, 250)
			}
		}
	}
}


function setCurrentPathJumpHome(){
	var theCurrentSegment = sessionStorage.getItem("currentPath");
	sessionStorage.setItem("previousPath", theCurrentSegment);
	kinesisBuilder.setTileOrder(sessionStorage.getItem("segmentCurrentlyIn"), 'Standalone-GluVivaKinesis-home.zip, StandaloneGluVivaKinesisSummitExample')
}

getPath();
