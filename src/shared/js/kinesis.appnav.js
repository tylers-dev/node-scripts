var mainNav = {
	// pageTitle : document.title,
  //   headerNav: document.querySelector('#header-nav'),
  //   sidebarNav: document.querySelector('.sidebar-nav'),
	// clickShield : document.querySelector('.shield'),

    loadNav : function() {
        // var navHTML,sideNavHTML;
        // navHTML = '<span id="indicationslink" class="link indicationslink"><span>Important Safety Information<span class="spacer">|</span></span></span>';
				// navHTML += '<span class="link prescribinginfo"><span>Full Prescribing Information<span class="spacer">|</span></span></span>';
				// navHTML += '<span class="link referenceslink"><span>References<span class="spacer">|</span></span></span>';
				// navHTML += '<span class="link helplink"><span>Help</span></span>';
        // navHTML += '<div id="logo"></div>';
        // navHTML += '<div id="homebutton"></div>';
				//
        // mainNav.headerNav.innerHTML = navHTML;
				mainNav.setEvents();
    },
		setEvents : function() {

			//Home
			$(".homebutton").on("touchend", function(){
				console.log("go")
				setCurrentPathJumpHome();
			})
			//Logo
			$("#logo").on("touchend", function(){
				kinesisBuilder.doubleTap();
			})
			//ISI
			$("#indicationslink").on("touchend", function(){
				popupToggle("isi");
			})
		}
};

$(function(){
	mainNav.loadNav();
})
