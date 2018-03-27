//Create the AVI popup.  
//Need to use createElement here since adding HTML as a string forces the page to re-evaluate the DOM to figure out the structure and causes load issues when put into Veeva
var avipopup = createReturnDiv("avi", "popup inactive button" , '');
var avileftside = createReturnDiv("", "avi-left" , "");
var avirightside = createReturnDiv("", "avi-right" , "");
var avichatwindowheadlineleft = createReturnDiv("", "avi-chatwindowheadline" , "Ask a question");
var avichatwindow = createReturnDiv("avichatwindow", "avi-chatwindow" , "");
var avichatwindowheadlineright = createReturnDiv("", "avi-chatwindowheadline" , "Choose a topic below:");
var avisubjectlist = createReturnDiv("avisubjectlist", "avi-subjectlist" , "");

avileftside.appendChild(avichatwindowheadlineleft);
avileftside.appendChild(avichatwindow);

avirightside.appendChild(avichatwindowheadlineright);
avirightside.appendChild(avisubjectlist);

avipopup.appendChild(avileftside);
avipopup.appendChild(avirightside);

avipopup.setAttribute("popBg", "1");
avipopup.setAttribute("onOpening", "avi.prototype.setVarsOnOpen()");
//avipopup.setAttribute("onClosing", "avi.prototype.resetAVI()");



//Create the Training mode popup.  
//Need to use createElement here since adding HTML as a string forces the page to re-evaluate the DOM to figure out the structure and causes load issues when put into Veeva
var trainingmodepopup = createReturnDiv("trainingmode", "popup inactive button" , '');
var trainingmodecontent = createReturnDiv("", "traingmodecontent" , '');
var trainingmodetext = createReturnDiv("", "trainingmodetext" , 'You are entering training mode,<br />are you sure you want to continue?');
var trainingmodebuttonone = createReturnDiv("", "trainingselectbutton" , 'Yes');
var trainingmodebuttontwo = createReturnDiv("", "trainingselectbutton" , 'No');

trainingmodebuttonone.setAttribute("ontouchend", "avi.prototype.openAVI()");
trainingmodebuttontwo.setAttribute("ontouchend", "closeThisPop(\'trainingmode\')");

trainingmodecontent.appendChild(trainingmodetext);
trainingmodecontent.appendChild(trainingmodetext);
trainingmodecontent.appendChild(trainingmodebuttonone);
trainingmodecontent.appendChild(trainingmodebuttontwo);
trainingmodepopup.appendChild(trainingmodecontent);

trainingmodepopup.setAttribute("popBg", "1");


//Create the touchpoint popup.  
//Need to use createElement here since adding HTML as a string forces the page to re-evaluate the DOM to figure out the structure and causes load issues when put into Veeva
var touchpoint = createReturnDiv("touchpoint", "touchpoint" , '');

function createReturnDiv(id, classlist, innerHTML){
	var thedivtoreturn = document.createElement("div");
	if(id !==null && id !==undefined && id !==""){
		thedivtoreturn.id = id;
	}
	if(classlist !==null && classlist !==undefined && classlist !==""){
		thedivtoreturn.className = classlist;
	}
	if(innerHTML !==null && innerHTML !==undefined && innerHTML !==""){
		thedivtoreturn.innerHTML = innerHTML;
	}
	return thedivtoreturn;
}

document.getElementsByTagName("body")[0].appendChild(avipopup)
document.getElementsByTagName("body")[0].appendChild(trainingmodepopup)
document.getElementsByTagName("body")[0].appendChild(touchpoint)

/*
var touchpoint = '<div id="touchpoint" class="touchpoint"></div>';

var trainingmodepopup = '<div id="trainingmode" class="popup inactive button" popBg="1">' +
        	'<div class="traingmodecontent">' +
               ' <div class="trainingmodetext">You are entering training mode,<br />are you sure you want to continue?</div>' +
                '<div class="trainingselectbutton" ontouchend="avi.prototype.openAVI()">Yes</div>' +
                '<div class="trainingselectbutton" ontouchend="closeThisPop(\'trainingmode\')">No</div>' +
            '</div>' +
        '</div>';



var avipopup = '<div id="avi" class="popup inactive button" popBg="1" onClosing="avi.prototype.resetAVI()">' +
         	'<div class="avi-left">' +
                '<div class="avi-chatwindowheadline">Ask a question</div>' +
                '<div id="avichatwindow" class="avi-chatwindow"></div>' +
            '</div>' +
            '<div class="avi-right">' +
                '<div class="avi-chatwindowheadline">Choose a topic below:</div>' +
                '<div id="avisubjectlist" class="avi-subjectlist"></div>' +
            '</div>' +
         '</div>';
*/

//document.getElementsByTagName("body")[0].innerHTML += trainingmodepopup;
//document.getElementsByTagName("body")[0].innerHTML += avipopup;
//document.getElementsByTagName("body")[0].innerHTML += touchpoint;

/*  Add style tag to head of page */
var cssTag = document.createElement("link"), head = document.getElementsByTagName("head")[0];
cssTag.href = '../shared/js/avi/lib/css/avi.css';
cssTag.rel = 'stylesheet';
head.appendChild(cssTag)