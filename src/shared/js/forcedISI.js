var hasSeenISI = sessionStorage.getItem("hasSeenISI"), forcedISIImplemented = true, userCanJump = false;
if (!hasSeenISI) {
    isi.setAttribute("onopening", "startTimerForCloseButton()");
    isi.setAttribute("onclosing", "setSessionVarRemoveAttributes()");
    popupToggle("isi");
    showRemoteISIBtn = true;
    isi_btn.classList.add("hiddenISIbutton");
   // leftnavigationalarrow.classList.add("hidden");
   //rightnavigationalarrow.classList.add("hidden");
    pagecontenttransition.classList.add("disableclick");
    setTimeout(function(){
      screenGrab();
    },200)
} else {
    closeThisPop("isi");
    userCanJump = true;
}

function startTimerForCloseButton(){
    setTimeout(function(){
        isi_btn.classList.remove("hiddenISIbutton");
       //leftnavigationalarrow.classList.remove("hidden");
       // rightnavigationalarrow.classList.remove("hidden");
        pagecontenttransition.classList.remove("disableclick");
    }, 3000);
}

function setSessionVarRemoveAttributes(){
    sessionStorage.setItem("hasSeenISI", true);
   // client.track('', "User has seen ISI", true);//Track it
    isi.setAttribute("onopening", "");
    isi.setAttribute("onclosing", "");
    userCanJump = true;
	removeFrame("isi")
}
