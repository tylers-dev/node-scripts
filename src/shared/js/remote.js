//Give sock status it's remote code
var remoteCode = localStorage.getItem("remoteCode");
if (!remoteCode) {
		remoteCode = (Math.floor(Math.random() * 99999999) + 9999).toString().substring(0, 4);
		localStorage.setItem("remoteCode", remoteCode);
}
//Add remote connection status with remote access code
var sockStatus = $("<div/>", {class:"sock-status", text:remoteCode}).append($("<div class='disconnect'></div>")).appendTo($("#customlayoutscontainer"));

var sock = new WebSocket('ws://52.54.226.144:443');
sock.binaryType = "arraybuffer";
var sockConnection = false;
sock.onopen = function (e) {
		console.log("Socket connected sucessfully");
		sock.onmessage = function (msg) {
				var data = JSON.parse(msg.data);
				switch (data.status) {

						//Successful connection to a remote control client
						case "wss-success":
								var approvedIP = localStorage.getItem("approvedIP") || "";
								if(approvedIP != data.ip){
									requestRemoteConnection(data.ip);
								}else{
									approvedConnection();
								}
								break;

						//Lost connection with paired client
						case "wss-disconnect":
							sockConnection = false;
							sockStatus.removeClass("connected");
						break;

						//Errors
	          case "wss-error":
	            console.log(data.msg)
	          break;

						//Touch coordinates
						case "touch":
							triggerTouch(data.data.xPerc, data.data.yPerc);
						break;

						//Close forced isi button
						case "close_isi":
							closeThisPop('isi');
							screenGrab();
						break;

						//Swipe left
						case "swipe_left":
							if(sockConnection) goNext();
						break;

						//Swipe right
						case "swipe_right":
							if(sockConnection) goPrev();
						break;
				}
		}
		//First Activate the Presentation to the server
		sock.send(JSON.stringify({
				status: "wss-activate",
				remoteCode: remoteCode
		}));
		//Send presentation code to server to await a remote connection
		sock.send(JSON.stringify({
				status: "wss-pairing",
				remoteCode: remoteCode
		}));
}

var showRemoteISIBtn = false;

function screenGrab(){
	if(!sockConnection) return false;
	console.log("Screenshot started");
	html2canvas(document.body, {
		onrendered: function(canvas) {
			try{
				var clone = document.createElement("canvas");
				clone.width = 667;
				clone.height = 500;
	      var ctx = clone.getContext('2d');
	      ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,667,500);
				var b64jpeg = clone.toDataURL("image/jpeg");
		    sock.send(_base64ToArrayBuffer(b64jpeg.substring(b64jpeg.indexOf(",")+1)));
				console.log("Screenshot sent");
			}catch(e){
				console.log("Screenshot Error");
			}
		}
	});
	//Check for forced isi button
	if(showRemoteISIBtn){
		showRemoteISIBtn=false;
		sock.send(JSON.stringify({ status: "forcedisi" }));
	}
}
function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
function triggerTouch(xPerc, yPerc){
	console.log("triggerTouch")
	var triggeredX = $(window).width() * xPerc;
	var triggeredY = $(window).height() * yPerc;
	var btn = $('.remotebtn').filter(function(i, el){
		var rect = el.getBoundingClientRect();
		return (triggeredX >= rect.left && triggeredX <= rect.left+rect.width && triggeredY >= rect.top && triggeredY <= rect.top+rect.height)
	})
	console.log("triggered", btn)
	btn.trigger("touchend");
}
function requestRemoteConnection(ip){
	var requestBtn = $("<div/>",{
		id:"remote-prompt",
		text:"Accept new remote connection"
	}).appendTo($("body")).one("touchend", function(){
		TweenMax.to(requestBtn, .1, { ease: Elastic.easeIn.config(.3, 0.3), x: "100%", onComplete:function(){ requestBtn.remove() } });
		console.log("local storage set to", ip)
		localStorage.setItem("approvedIP", ip);
		setTimeout(function(){
			approvedConnection();
		},200)
	});
	TweenMax.from(requestBtn, .5, { ease: Elastic.easeOut.config(.3, 0.3), x: "100%" });
	//Waiting approval response
	sock.send(JSON.stringify({ status: "waiting" }));
}
function approvedConnection(){
	sockConnection = true;
	sock.send(JSON.stringify({ status: "approved" }));
	sockStatus.addClass("connected");
	screenGrab();
}

//Setup remote buttons
$(function(){
	$(".remotebtn").on("touchend", function(){
		sock.send(JSON.stringify({ status: "button-pressed" }));
		setTimeout(function(){
			screenGrab();
		},20)
	})
	//Disconnect
	$(".sock-status .disconnect").on("touchend", function(){
		localStorage.setItem("approvedIP", "");
		sock.send(JSON.stringify({ status: "wss-unpairing" }));
	})
})
