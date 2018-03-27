//Declare an array to hold the objects the user selects
var selectedSlidesInfoArray = [],
  eligibleForDelete = [];

//Arrays used for creating the JSON object for saving/reading later
var savedPaths = new Array(8);

var dataForDisplay, myInsightsDataForDisplay, overWrite = "false",
  parsedJSON, myInsightsParsedJson, isSelectionMode = false,
  editMode = false,
  scrollPosition, segment, sectionSize, scrollRecorder, longTapTimer, draggableElements, zipName, modePath, reorderGroup, scrollerMain, scrollerSingle;
var kinesisBuilder = {
  init: function(args) {
    params = {
      addSlideBusinessRule: args.addSlideBusinessRule,
      deleteSlideBusinessRule: args.deleteSlideBusinessRule,
      dragAndDropBusinessRule: args.dragAndDropBusinessRule,
      reorderAfterDragAndDrop: args.reorderAfterDragAndDrop,
      homeSlide: args.homeSlide,
      dsaID: args.dsaID,
      tileOrder: kinesisBuilder.lookUpSegmentInfo('tileOrder', segments[0].segment),
      defaultSegment: kinesisBuilder.lookUpSegmentInfo('segment', segments[1].segment),
      devMode: args.devMode
    };

    modePath = "../shared/";
    // if (params.devMode === true) {
    //   modePath = "";
    // } else {
    //   modePath = "../shared/";
    // }

    /*scrollerMain = new FTScroller(document.getElementById('scrollablesection'), {
    	scrollingY: false,
    	maxFlingDuration: 500,
    	bouncing:false,
    	scrollbars:false,
    	scrollBoundary:50,
    	updateOnChanges:true
    });

    scrollerMain.addEventListener('scrollstart', function() {
    	scrollablesection.classList.add("scrolling");
    	kinesisBuilder.recordScrollPosition(scrollerMain.scrollLeft);
    	pageIsScrolling = true;
    }, false);

    scrollerMain.addEventListener('scrollend', function() {
    	scrollablesection.classList.remove("scrolling");
    	kinesisBuilder.recordScrollPosition(scrollerMain.scrollLeft);
    	pageIsScrolling = false;
    }, false);*/

    this.getDataForDisplay(); //Get any previous data the user may have stored
    this.getSegmentList(false);

    sessionStorage.setItem("homeSlide", params.homeSlide + ", " + params.dsaID);
  },

  getSegmentList: function(editscreen) {
    //segmentsscroller.innerHTML = '';
    if (sessionStorage.getItem("segmentCurrentlyIn")) {
      var segmentButtons = document.getElementsByClassName("segmentbutton");
      this.setTileOrder(sessionStorage.getItem("segmentCurrentlyIn"));
      for (i = 0; i < segmentButtons.length; i++) {
        if (segmentButtons[i].dataset.segmentname === sessionStorage.getItem("segmentCurrentlyIn")) {
          segmentButtons[i].classList.add("selectedbutton");
        } else {
          segmentButtons[i].classList.remove("selectedbutton");
        }
      }
    } else {
      this.setTileOrder(params.defaultSegment);
    }

  },

  applySegmentation: function(segmentName) {
    var tilelist = document.getElementById("tilelist"),
      scrollingSection = document.getElementById("scrollablesection");
    if (kinesisBuilder.getTileOrder() === undefined || kinesisBuilder.getTileOrder() === "undefined" || kinesisBuilder.getTileOrder() === null || kinesisBuilder.getTileOrder() === "null" || kinesisBuilder.getTileOrder() === "") {
      tileOrder = kinesisBuilder.lookUpSegmentInfo('tileOrder', segmentName);
      kinesisBuilder.setTileOrder(params.defaultSegment);
      tileOrder = kinesisBuilder.getTileOrder().split(",");
    } else {
      tileOrder = kinesisBuilder.getTileOrder().split(",");
      //kinesisBuilder.setTileOrder(sessionStorage.getItem("segmentCurrentlyIn"));
    }

    sessionStorage.setItem("currentPath", tileOrder);
    sessionStorage.setItem("tileOrder", tileOrder);
    //Blank out the existing slides
    tilelist.innerHTML = "";


    for (var i = 0; i < tileOrder.length; i++) {
      var slidesHTML = "",
        newLI = document.createElement("li"),
        target = kinesisBuilder.lookUpSlideInfo('contentLink', tileOrder[i].toString()).split(",");
      slidesHTML = '<div class="markedTab">&check;</div>';
      newLI.setAttribute("data-id", tileOrder[i]);
      newLI.style.backgroundImage = "url(" + modePath + "images/" + kinesisBuilder.lookUpSlideInfo('image', tileOrder[i].toString()) + ")";
      newLI.innerHTML = slidesHTML;
      newLI.classList.add("remotebtn");
      newLI.target0 = target[0];
      newLI.target1 = target[1];
      tilelist.appendChild(newLI);
      $(newLI).on("touchend", function(){
        kinesisBuilder.homePageJumpcheck(this.target0, this.target1, this);
      })
    }

    var slides = document.querySelectorAll("ul.tile-list li"),
      numOfTiles = slides.length;
    numOfTiles = numOfTiles;
    sectionSize = numOfTiles * 400; // Establish width of the container DIV for mini-tiles
    //tilelist.style.width = Math.floor(sectionSize) + 'px';
    if (sectionSize > 912) {
      //tilelist.classList.add("scrollablewidth");
    } else {
      //tilelist.classList.remove("scrollablewidth");
    }

    //this.setScrollPosition();
  },

  homePageJumpcheck: function(zipfile, dsa, element) {
    if (isSelectionMode && !pageIsScrolling) {
      clearTimeout(longTapTimer);
      kinesisBuilder.slideSelection(element);
    } else if (editMode && !pageIsScrolling) {
      clearTimeout(longTapTimer);
    } else if (!pageIsScrolling) {
      console.log("Veeva gotoSlide", zipfile, dsa);
      com.veeva.clm.gotoSlide(zipfile, dsa);
    }
    //return false;
  },

  setScrollPosition: function() {
    var scrollPosition = Number(sessionStorage.getItem(this.getSegment() + "ScrollPosition"))
    scrollerMain.scrollTo(scrollPosition)
  },

  recordScrollPosition: function(position) {

    sessionStorage.setItem(kinesisBuilder.getSegment() + "ScrollPosition", position);
  },

  setTileOrder: function(segmentName, jumpLink, clearCurrentCustomLayout, event) {
    var tileOrder = sessionStorage.setItem("tileOrder", kinesisBuilder.lookUpSegmentInfo("tileOrder", segmentName)),
      homebuttons = document.getElementsByClassName("utilitybutton");
    for (i = 0; i < homebuttons.length; i++) {
      homebuttons[i].classList.remove("selectedbutton")
    }
    if (event) {
      event.target.classList.add("selectedbutton")
    }
    kinesisBuilder.setSegment(segmentName);

    if (jumpLink && jumpLink !== "reset") {
      com.veeva.clm.gotoSlide(jumpLink);
      if (clearCurrentCustomLayout) {
        sessionStorage.setItem("currentCustomLayout", "");
      }
    } else {
      kinesisBuilder.applySegmentation();
      if (segmentName !== "home") {
        //tilelisttitle.innerHTML = kinesisBuilder.lookUpSegmentInfo("segmentDescription", segmentName);
        tilelist.classList.add("segment");
        //showallbutton.classList.add("visible");
      } else {
        customlayoutsinglecontainertilelist.innerHTML = "";
        tilelist.classList.remove("hidden");
        //tilelisttitle.setAttribute("ontouchend", '');
        bodyhome.classList.remove("displayingsinglelayout");
        //tilelisttitle.innerHTML = "All slides";
        tilelist.classList.remove("segment");
        //showallbutton.classList.remove("visible");
      }
    }
  },

  getTileOrder: function() {
    var tileOrder = sessionStorage.getItem("tileOrder");
    return tileOrder;
  },

  setSegment: function(segmentName) {
    sessionStorage.setItem("segment", segmentName);
    sessionStorage.setItem("segmentCurrentlyIn", segmentName);
  },

  getSegment: function() {
    return sessionStorage.getItem("segment");
  },

  loadDisplaySaved: function(dataForDisplay, myInsightsDataForDisplay) {
    var customlayouttilecontainer = document.getElementById("customlayouttilecontainer"),
      explodedSlides, textForName = "",
      dsaHasSavedData, dsaHasSavedMyInsightsData;

    //blank the customlayouttilecontainer

    if (dataForDisplay) {
      parsedJSON = JSON.parse(dataForDisplay);
      if (parsedJSON.hasOwnProperty(params.dsaID)) {
        dsaHasSavedData = true;
      } else {
        dsaHasSavedData = false;
      }

    }

    if (myInsightsDataForDisplay) {
      myInsightsParsedJson = JSON.parse(myInsightsDataForDisplay);
      var myInsightsProperty = "MyInsights" + params.dsaID;
      if (myInsightsParsedJson.hasOwnProperty(myInsightsProperty)) {
        dsaHasSavedMyInsightsData = true;
      } else {
        dsaHasSavedMyInsightsData = false;
      }
    }
    //parse data from display
    if (dsaHasSavedData) {
      customlayoutholder.innerHTML = '';

      for (i = 0; i < parsedJSON[params.dsaID][0].savedCallFlows.length; i++) {
        var clickForPathItem = "kinesisBuilder.clickFunctionForTileGroup(" + i + ", this, '')",
          clickForNameItem = "kinesisBuilder.changeLayoutName(" + i + ")",
          clickForDeleteItem = "kinesisBuilder.deleteLayout(" + i + ")",
          numberOfSlides = parsedJSON[params.dsaID][0].savedCallFlows[i].callFlow.split(";"),
          classNameForDiv, iterateNum, savedDiv = document.createElement("div"),
          savedImagesDiv = document.createElement("div"),
          savedSpan = document.createElement("span"),
          savedDelete = document.createElement("div"),
          interiorDiv = document.createElement("div"),
          imagesHMTL = "",
          firstTwoSlides = false,
          oneslide = false;
        if (numberOfSlides.length >= 3) {
          classNameForDiv = "threeimages";
          iterateNum = 5;
        } else if (numberOfSlides.length === 3) {
          classNameForDiv = "twoimages default";
          firstTwoSlides = true;
        } else if (numberOfSlides.length === 2) {
          classNameForDiv = "twoimages default";
          iterateNum = 2;
        } else if (numberOfSlides.length === 1) {
          classNameForDiv = "oneimages default";
          oneslide = true;
        } else {
          iterateNum = numberOfSlides.length;
        }

        textForName = parsedJSON[params.dsaID][0].savedCallFlows[i].callFlowName;
        if (oneslide) {
          for (j = 0; j < 1; j++) {
            imagesHMTL += "<img src='" + modePath + "images/" + this.lookUpSlideInfo('image', numberOfSlides[j]) + "' />";
            //imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            savedImagesDiv.innerHTML = imagesHMTL;
          }
          firstTwoSlides = false;
        } else if (firstTwoSlides) {
          for (j = 1; j > -1; j--) {
            if (j === 0) {
              imagesHMTL += "<img src='" + modePath + "images/" + this.lookUpSlideInfo('image', numberOfSlides[j]) + "' />";
              //imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            } else {
              imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            }
            savedImagesDiv.innerHTML = imagesHMTL;
          }
          firstTwoSlides = false;
        } else {
          for (j = iterateNum; j > 1; j--) {
            if ((j - 1) === 1) {
              imagesHMTL += "<img src='" + modePath + "images/" + this.lookUpSlideInfo('image', numberOfSlides[j - 1]) + "' />";
              //imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            } else {
              imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j - 1]) + "'></div>";
            }
            savedImagesDiv.innerHTML = imagesHMTL;
          }
        }
        savedDelete.className = "deletegroupbutton";
        savedDelete.setAttribute("ontouchend", clickForDeleteItem);
        savedDiv.className = "tilegroup savablegroup";
        savedDiv.setAttribute("data-nodeinformation", JSON.stringify(parsedJSON[params.dsaID][0].savedCallFlows[i]));
        savedDiv.setAttribute("data-id", i)
        savedDiv.setAttribute("data-headline", textForName)
        savedImagesDiv.className = "tilegroupimages";
        //savedSpan.setAttribute("ontouchend", clickForNameItem);
        interiorDiv.className = "interiordiv";
        savedSpan.innerHTML = textForName;
        if (textForName.length > 15) {
          savedSpan.className = "tilegroupname double";
        } else {
          savedSpan.className = "tilegroupname";
        }
        savedDiv.setAttribute("ontouchend", clickForPathItem);
        savedDiv.appendChild(savedImagesDiv);
        interiorDiv.appendChild(savedSpan);
        savedDiv.appendChild(interiorDiv);
        savedDiv.appendChild(savedDelete);
        customlayoutholder.dataset.datapresent = "true";
        customlayoutholder.appendChild(savedDiv);
        if (savedSpan.clientHeight > 20) {
          interiorDiv.classList.add("double")
        }
      }
      customlayoutholder.innerHTML += '<div id="newlayoutbutton" class="newlayoutbutton" ontouchend="kinesisBuilder.addSlidesToGroup(\'newgroup\')"><span>New Layout</span></div>';

    } else { //no data
      console.log("No data");
      customlayoutholder.innerHTML = "<div class='nodatamessage'>No Custom Layouts</div>";
      customlayoutholder.innerHTML += '<div id="newlayoutbutton" class="newlayoutbutton" ontouchend="kinesisBuilder.addSlidesToGroup(\'newgroup\')"><span>New Layout</span></div>';
    }

    if (dsaHasSavedMyInsightsData) {
      myinsightscustomlayoutholder.innerHTML = '';

      for (k = 0; k < myInsightsParsedJson["MyInsights" + params.dsaID][0].savedCallFlows.length; k++) {
        var clickForPathItem = "kinesisBuilder.clickFunctionForTileGroup(" + k + ", this, 'MyInsights')",
          clickForNameItem = "kinesisBuilder.changeLayoutName(" + k + ")",
          clickForDeleteItem = "kinesisBuilder.deleteLayout(" + k + ")",
          numberOfSlides = myInsightsParsedJson["MyInsights" + params.dsaID][0].savedCallFlows[k].callFlow.split(";"),
          classNameForDiv, iterateNum, savedDiv = document.createElement("div"),
          savedImagesDiv = document.createElement("div"),
          savedSpan = document.createElement("span"),
          savedDelete = document.createElement("div"),
          interiorDiv = document.createElement("div"),
          imagesHMTL = "",
          firstTwoSlides = false,
          oneslide = false;
        if (numberOfSlides.length >= 3) {
          classNameForDiv = "threeimages";
          iterateNum = 4;
        } else if (numberOfSlides.length === 3) {
          classNameForDiv = "twoimages default";
          firstTwoSlides = true;
        } else if (numberOfSlides.length === 2) {
          classNameForDiv = "twoimages default";
          iterateNum = 2;
        } else if (numberOfSlides.length === 1) {
          classNameForDiv = "oneimages default";
          oneslide = true;
        } else {
          iterateNum = numberOfSlides.length;
        }

        textForName = myInsightsParsedJson["MyInsights" + params.dsaID][0].savedCallFlows[k].callFlowName;
        if (oneslide) {
          for (j = 0; j < 1; j++) {
            imagesHMTL += "<img src='" + modePath + "images/" + this.lookUpSlideInfo('image', numberOfSlides[j]) + "' />";
            //imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            savedImagesDiv.innerHTML = imagesHMTL;
          }
          firstTwoSlides = false;
        } else if (firstTwoSlides) {
          for (j = 1; j > -1; j--) {
            if (j === 0) {
              imagesHMTL += "<img src='" + modePath + "images/" + this.lookUpSlideInfo('image', numberOfSlides[j]) + "' />";
              //imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            } else {
              imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            }
            savedImagesDiv.innerHTML = imagesHMTL;
          }
          firstTwoSlides = false;
        } else {
          for (j = iterateNum; j > 1; j--) {
            if ((j - 1) === 1) {
              imagesHMTL += "<img src='" + modePath + "images/" + this.lookUpSlideInfo('image', numberOfSlides[j - 1]) + "' />";
              //imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j]) + "'></div>";
            } else {
              imagesHMTL += "<div class='segmentcolor " + this.lookUpSlideInfo('segment', numberOfSlides[j - 1]) + "'></div>";
            }
            savedImagesDiv.innerHTML = imagesHMTL;
          }
        }
        savedDelete.className = "deletegroupbutton";
        savedDelete.setAttribute("ontouchend", clickForDeleteItem);
        savedDiv.className = "tilegroup";
        savedDiv.setAttribute("data-nodeinformation", JSON.stringify(myInsightsParsedJson["MyInsights" + params.dsaID][0].savedCallFlows[k]));
        savedDiv.setAttribute("data-id", k);
        savedDiv.setAttribute("data-headline", textForName)
        // savedImagesDiv.setAttribute("ontouchend", clickForPathItem);
        savedImagesDiv.className = "tilegroupimages";
        // savedSpan.setAttribute("ontouchend", clickForNameItem);
        interiorDiv.className = "interiordiv";
        savedSpan.innerHTML = textForName;
        if (textForName.length > 15) {
          savedSpan.className = "tilegroupname double";
        } else {
          savedSpan.className = "tilegroupname";
        }
        savedDiv.setAttribute("ontouchend", clickForPathItem);
        savedDiv.appendChild(savedImagesDiv);
        interiorDiv.appendChild(savedSpan);
        savedDiv.appendChild(interiorDiv);
        savedDiv.appendChild(savedDelete);
        myinsightscustomlayoutholder.dataset.datapresent = "true";
        myinsightscustomlayoutholder.appendChild(savedDiv);
        if (savedSpan.clientHeight > 20) {
          interiorDiv.classList.add("double")
        }
      }

    } else { //no data
      myinsightscustomlayoutholder.innerHTML = "<div class='nodatamessage'>No MyInsights Layouts</div>"
    }


    if (sessionStorage.getItem("currentCustomLayout") && !tilelist.classList.contains("hidden")) {
      this.openCurrentCustomLayout(Number(sessionStorage.getItem("currentCustomLayout")));
    } else if (sessionStorage.getItem("openCustomLayouts")) {
      customlayoutcontainer.classList.remove("open");
      sessionStorage.setItem("openCustomLayouts", "");
    }

    closeThisPop("savecallflowpopup");
    callFlowName.blur();
    selectedSlidesInfoArray.length = 0;

  },

  clickFunctionForTileGroup: function(num, element, callflowtype) { //This writes the HTML for the popup that displays the information for the selected call flow
    var editSlidesInfoArray, scrollablesection = document.getElementById("customlayoutsinglecontainer"),
      homebuttons = document.getElementsByClassName("homebutton"),
      classnameforediting = callflowtype === 'MyInsights' ? '' : 'savable';

    if (callflowtype === 'MyInsights') {
      editSlidesInfoArray = myInsightsParsedJson["MyInsights" + params.dsaID][0].savedCallFlows[num].callFlow.split(";");
      var callFlowPath = myInsightsParsedJson["MyInsights" + params.dsaID][0].savedCallFlows[num].callFlow;
    } else {
      editSlidesInfoArray = parsedJSON[params.dsaID][0].savedCallFlows[num].callFlow.split(";");
      var callFlowPath = parsedJSON[params.dsaID][0].savedCallFlows[num].callFlow;
      parsedJSON = JSON.parse(dataForDisplay);
    }
    //Figure out how many slides per brand there are so we can add the appropriate amount of blank slides in the popup
    bodyhome.classList.remove("specialedit");
    for (i = 0; i < homebuttons.length; i++) {
      homebuttons[i].classList.remove("selectedbutton")
    }
    if (event) {
      if (!event.target.classList.contains("homebutton")) {
        event.target.parentNode.classList.add("selectedbutton");
      } else {
        event.target.classList.add("selectedbutton");
      }
    }
    if (isSelectionMode) {
      if (callflowtype === 'MyInsights') {
        //do nothing
      } else {
        this.addSlidesToGroup(num);
      }
    } else {
      customlayoutsinglecontainertilelist.innerHTML = "";
      customlayoutsinglecontainertilelist.dataset.id = num;

      tilelist.classList.add("hidden");
      for (i = 0; i < (editSlidesInfoArray.length); i++) {
        (function() {
          var slideSrc = kinesisBuilder.lookUpSlideInfo('src', editSlidesInfoArray[i]),
            slidesHTML = "",
            newContainerDiv = document.createElement("div"),
            newClickDiv = document.createElement("div"),
            newDeleteDiv = document.createElement("div"),
            target = kinesisBuilder.lookUpSlideInfo('contentLink', editSlidesInfoArray[i]).split(","),
            clickEventListner = '',
            requiredSlide = kinesisBuilder.lookUpSlideInfo('required', editSlidesInfoArray[i]).split(",");
          clickEventListner = function() {
            kinesisBuilder.homePageJumpcheck(target[0], target[1])
          };
          newDeleteDiv.className = "deleteslide";
          newDeleteDiv.setAttribute("ontouchend", "kinesisBuilder.deleteSlide(" + i + ")");
          newContainerDiv.appendChild(newDeleteDiv);
          newContainerDiv.setAttribute("data-id", editSlidesInfoArray[i]);
          newContainerDiv.setAttribute("data-required", requiredSlide);
          newContainerDiv.style.backgroundImage = "url(" + modePath + "images/" + kinesisBuilder.lookUpSlideInfo('image', editSlidesInfoArray[i].toString()) + ")";
          if (callflowtype === 'MyInsights') {
            singlelayoutheadline.setAttribute("ontouchend", "")
          } else {
            newContainerDiv.setAttribute("ontouchstart", "kinesisBuilder.longTap(" + num + ", this)");
            newContainerDiv.setAttribute("ontouchend", "kinesisBuilder.cancelLongTap()");
            singlelayoutheadline.setAttribute("ontouchend", "kinesisBuilder.changeLayoutName(" + num + ")")
          }

          newContainerDiv.addEventListener("touchend", clickEventListner, false);
          if (i === 0) {
            newContainerDiv.className = "singletile tile visibletile " + classnameforediting;
          } else {
            newContainerDiv.className = "singletile tile visibletile draggabletile" + classnameforediting;
          }
          customlayoutsinglecontainertilelist.appendChild(newContainerDiv);
          customlayoutsinglecontainertilelist.dataset.path = callFlowPath;
        }())
      }

      var currentPathList = document.getElementById("customlayoutsinglecontainertilelist").dataset.path;
      var currentPath = currentPathList.replace(/\;/g, ',');
      //sessionStorage.setItem("currentCustomLayout", customlayoutsinglecontainertilelist.dataset.id);
      sessionStorage.setItem("currentPath", currentPath);
      //sessionStorage.setItem("segmentCurrentlyIn", "custom");

      var slides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.tile"),
        numOfTiles = slides.length;
      numOfcolumns = numOfTiles;
      sectionSize = numOfcolumns * 400; // Establish width of the container DIV for mini-tiles
      //customlayoutsinglecontainertilelist.style.width = Math.floor(sectionSize) + 'px';
      if (sectionSize > 912) {
        //customlayoutsinglecontainertilelist.classList.add("scrollablewidth");
      } else {
        //customlayoutsinglecontainertilelist.classList.remove("scrollablewidth");
      }

      singlelayoutheadline.innerHTML = element.dataset.headline;
      bodyhome.classList.add("displayingsinglelayout");
    }

  },

  openCurrentCustomLayout: function(currentCustomLayout) {
    //this.toggleCustomLayouts();
    this.clickFunctionForTileGroup(currentCustomLayout);
  },

  toggleCustomLayouts: function() {
    bodyhome.classList.toggle("customlayoutlibraryopen");
    if (bodyhome.classList.contains("editedlayout") || bodyhome.classList.contains("displayingsinglelayout")) {
      editMode = false;
      kinesisBuilder.disableDraggable();
      isDraggable = false;
      draggableElements = null;
    }
    bodyhome.classList.remove("editlayouts", "editedlayout", "specialedit", "displayingsinglelayout");
    tilelist.classList.remove("hidden");

    //customlayoutscontainer.classList.toggle("opened")
  },

  openCustomLayoutSingle: function() {
    currentPathList = document.getElementById("customlayoutsinglecontainertilelist").dataset.path;
    currentPath = currentPathList.replace(/\;/g, ',');
    singlelayoutheadline.innerHTML = customlayoutsinglecontainertilelist.data.headline;
    bodyhome.classList.remove("deletelayouts");
    bodyhome.classList.add("editlayouts");
    sessionStorage.setItem("currentCustomLayout", customlayoutsinglecontainertilelist.dataset.id);
    sessionStorage.setItem("currentPath", currentPath);
    sessionStorage.setItem("segmentCurrentlyIn", "custom");
  },

  closeCustomLayoutSingle: function() {
    //customlayoutsingle.classList.remove("open");
    //segmentscontainer.classList.remove("collapsed");
    tilelist.classList.remove("hidden");
    bodyhome.classList.remove("editlayouts", "editedlayout", "specialedit", "displayingsinglelayout");
    bodyhome.classList.add("deletelayouts");

    sessionStorage.setItem("currentCustomLayout", "");
    //mainNav.closeSegmentNav();
    sessionStorage.setItem("currentPath", sessionStorage.getItem("tileOrder"));
    sessionStorage.setItem("segmentCurrentlyIn", sessionStorage.getItem("segment"));
    editMode = false;
    kinesisBuilder.disableDraggable();
    isDraggable = false;
    draggableElements = null;
  },

  slideSelection: function(element) { //This fires each time the user taps a slide
    var tileID = element.getAttribute('data-id');
    if (isSelectionMode === true) {
      if (element.classList.contains('selectedTab')) { //Selected, remove the selectedTab class
        element.classList.remove('selectedTab');
        kinesisBuilder.removeArrayItem(selectedSlidesInfoArray, tileID);
        if (selectedSlidesInfoArray.length === 0) {
          newlayoutbutton.classList.remove("enabled");
        }
      } else { //Not selected, select it
        element.classList.add('selectedTab');
        newlayoutbutton.classList.add("enabled");
        kinesisBuilder.addArrayItem(selectedSlidesInfoArray, tileID);
      }

    } else {
      //Not in selection mode
    }
  },


  addSlidesTo: function() {
    //customlayoutcontainer.classList.add("open");
    kinesisBuilder.toggleCustomLayouts();
    //document.getElementById("customlayoutcontainerheadline").classList.add("visible");
    bodyhome.classList.remove("selectslides");
    bodyhome.classList.add("cancel");
    //document.getElementById("addtoslidesbutton").classList.remove("visible");
  },

  addSlidesToGroup: function(group) {
    var existingcallFlow, callFlowToSaveTo = 0,
      dsaHasSavedData;
    if (dataForDisplay) {
      parsedJSON = JSON.parse(dataForDisplay);
      if (parsedJSON.hasOwnProperty(params.dsaID)) {
        dsaHasSavedData = true;
      } else {
        dsaHasSavedData = false;
      }
    }
    if (group === "newgroup") {
      popupToggle("savecallflowpopup");
      callFlowName.focus();
      window.scrollTo(0, 0);
      existingcallFlow = "";
      document.getElementById("savecallflowpopup").classList.add("newpopup");
      document.getElementById("savecallflowpopup").classList.remove("editpopup");
      if (dsaHasSavedData) {
        callFlowToSaveTo = parsedJSON[params.dsaID][0].savedCallFlows.length;
      } else {
        callFlowToSaveTo = 0;
      }
    } else {
      existingcallFlow = parsedJSON[params.dsaID][0].savedCallFlows[group].callFlow;
      callFlowToSaveTo = group;
    }
    params.addSlideBusinessRule(callFlowToSaveTo, existingcallFlow);
  },

  changeLayoutName: function(groupNum) {
    parsedJSON = JSON.parse(dataForDisplay);
    oldName = parsedJSON[params.dsaID][0].savedCallFlows[groupNum].callFlowName
    document.getElementById("callFlowName").value = oldName;
    document.getElementById("popupSaveButton").setAttribute("ontouchend", "kinesisBuilder.saveObject(" + groupNum + ", " + JSON.stringify(parsedJSON[params.dsaID][0].savedCallFlows[groupNum].callFlow) + ")")
    document.getElementById("savecallflowpopup").classList.add("editpopup");
    document.getElementById("savecallflowpopup").classList.remove("newpopup");
    popupToggle("savecallflowpopup");
    callFlowName.focus();
    window.scrollTo(0, 0);
  },

  deleteLayouts: function() {
    bodyhome.classList.add("specialedit");
    bodyhome.classList.remove("deletelayouts");
    specialcancelbutton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteLayout()");
    specialsavebutton.setAttribute("ontouchend", "kinesisBuilder.saveDeleteLayout()");
    specialsavebutton.setAttribute("ontouchend", "popupToggle('confirmsave')");
    confirmsaveButton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteLayout()");
    confirmsaveSaveButton.setAttribute("ontouchend", "kinesisBuilder.saveDeleteLayout()");
  },

  deleteLayout: function(tileGroupNum) {
    var tilegroups = document.getElementsByClassName("tilegroup");
    touchedGroup = tilegroups[Number(customlayoutsinglecontainertilelist.dataset.id)];
    touchedGroup.classList.add("deleting");
    touchedGroup.classList.remove("savablegroup");
    //setTimeout(function () { touchedGroup.classList.add("gone"); }, 300);
    eligibleForDelete.push(tileGroupNum);

    //menuopenbutton.setAttribute("ontouchend", "popupToggle('confirmcancel')");
    popupToggle('confirmcancel')
    confirmcancelButton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteLayout()");
    confirmcancelSaveButton.setAttribute("ontouchend", "kinesisBuilder.saveDeleteLayout()");
    //menuopenbutton.addEventListener("touchend", kinesisBuilder.confirmCancel, false);
  },

  cancelDeleteLayout: function() {
    var tileGroups = document.getElementsByClassName("tilegroup");
    for (i = 0; i < tileGroups.length; i++) {
      tileGroups[i].classList.remove("deleting", "gone");
      tileGroups[i].classList.add("savablegroup");
    }
    //bodyhome.classList.remove("specialedit")
    // eligibleForDelete.length = 0;
    //menuopenbutton.setAttribute("ontouchend", "mainNav.openSegmentNav()");

    //menuopenbutton.removeEventListener("touchend", kinesisBuilder.confirmCancel, false);
    closeThisPop("confirmcancel");
    closeThisPop("confirmsave");
    // bodyhome.classList.add("deletelayouts");
  },

  saveDeleteLayout: function() {
    var editedTileGroups = [],
      parsedJSON = JSON.parse(dataForDisplay),
      savableTileGroup = document.getElementsByClassName("savablegroup");

    for (i = 0; i < savableTileGroup.length; i++) {
      editedTileGroups.push(JSON.parse(savableTileGroup[i].dataset.nodeinformation));
    }

    if (editedTileGroups.length !== 0) {
      dataForDisplay = '{"' + params.dsaID + '":[{ "savedCallFlows" :' + JSON.stringify(editedTileGroups) + ' }]}';
      this.saveData(dataForDisplay);
    } else {
      dataForDisplay = '';
      this.saveData(dataForDisplay);
    }
    eligibleForDelete.length = 0;
    editedTileGroups.length = 0;

    //menuopenbutton.setAttribute("ontouchend", "mainNav.openSegmentNav()");
    //menuopenbutton.removeEventListener("touchend", kinesisBuilder.confirmCancel, false);
    //specialcancelbutton.setAttribute("ontouchend", "");
    //specialsavebutton.setAttribute("ontouchend", "");
    //confirmsaveButton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteSlide()");
    //confirmsaveSaveButton.setAttribute("ontouchend", "kinesisBuilder.saveDeleteSlide()");
    customlayoutsinglecontainertilelist.innerHTML = '';
    bodyhome.classList.remove("specialedit");
    bodyhome.classList.remove("displayingsinglelayout");
    closeThisPop("confirmcancel");
    closeThisPop("confirmsave");
    this.getSegmentList(true);
    editMode = false;
    kinesisBuilder.disableDraggable();
    isDraggable = false;
    draggableElements = null;
  },

  confirmCancel: function(event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    popupToggle("confirmcancel");
  },

  editLayout: function() {
    bodyhome.classList.add("specialedit");
    specialcancelbutton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteSlide()");
    deletelayoutsbutton.setAttribute("ontouchend", 'kinesisBuilder.deleteLayout(' + Number(customlayoutsinglecontainertilelist.dataset.id) + ')');

    customlayoutsinglecontainertilelist.innerHTML = "";
    var listOfTiles = customlayoutsinglecontainertilelist.dataset.path,
      tilesArray = listOfTiles.split(";")
    tilelist.classList.add("hidden");
    for (i = 0; i < (tilesArray.length); i++) {
      (function() {
        var slideSrc = kinesisBuilder.lookUpSlideInfo('src', tilesArray[i]),
          slidesHTML = "",
          newContainerDiv = document.createElement("div"),
          newClickDiv = document.createElement("div"),
          newDeleteDiv = document.createElement("div"),
          target = kinesisBuilder.lookUpSlideInfo('contentLink', tilesArray[i]).split(","),
          clickEventListner = '',
          requiredSlide = kinesisBuilder.lookUpSlideInfo('required', tilesArray[i]).split(",");
        clickEventListner = function() {
          kinesisBuilder.homePageJumpcheck(target[0], target[1])
        };
        newDeleteDiv.className = "deleteslide";
        newDeleteDiv.setAttribute("ontouchend", "kinesisBuilder.deleteSlide(" + i + ")");
        newContainerDiv.appendChild(newDeleteDiv);
        newContainerDiv.setAttribute("data-id", tilesArray[i]);
        newContainerDiv.setAttribute("data-required", requiredSlide);
        newContainerDiv.style.backgroundImage = "url(" + modePath + "images/" + kinesisBuilder.lookUpSlideInfo('image', tilesArray[i].toString()) + ")";
        newContainerDiv.setAttribute("ontouchstart", "kinesisBuilder.longTap(" + Number(customlayoutsinglecontainertilelist.dataset.id) + ", this)");
        newContainerDiv.setAttribute("ontouchend", "kinesisBuilder.cancelLongTap()");
        newContainerDiv.addEventListener("touchend", clickEventListner, false);
        if (i === 0) {
          newContainerDiv.className = "singletile tile visibletile savable";
        } else {
          newContainerDiv.className = "singletile tile visibletile savable draggabletile";
        }
        customlayoutsinglecontainertilelist.appendChild(newContainerDiv);
        //customlayoutsinglecontainertilelist.dataset.path = parsedJSON[params.dsaID][0].savedCallFlows[Number(customlayoutsinglecontainertilelist.dataset.id)].callFlow;
      }())


    }

    if (Boolean((tilesArray.length) % 2)) { //test to see if the number of slides is odd, then add a blank li to the ul for display purposes
      var blankDiv = document.createElement("div");
      blankDiv.className = "blankdynamictile tile visibletile";
      blankDiv.id = "blankslidedynamic";
      customlayoutsinglecontainertilelist.appendChild(blankDiv);
    }

    var slides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.tile"),
      numOfTiles = slides.length;
    numOfcolumns = numOfTiles / 2;
    sectionSize = numOfcolumns * 400; // Establish width of the container DIV for mini-tiles
    //customlayoutsinglecontainertilelist.style.width = Math.floor(sectionSize) + 'px';
    if (sectionSize > 912) {
      //customlayoutsinglecontainertilelist.classList.add("scrollablewidth");
    } else {
      //customlayoutsinglecontainertilelist.classList.remove("scrollablewidth");
    }


    editMode = true;
  },

  deleteSlide: function(slideNum) {
    var slides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.singletile"),
      visibleSlides, tileslist = document.querySelectorAll("#customlayoutsinglecontainertilelist div.tile"),
      numOfTiles, touchedTile = event.target.parentNode,
      scrollablesection = document.getElementById("customlayoutsinglecontainer"),
      tilelist = document.getElementById("customlayoutsinglecontainertilelist");

    //eligibleForDelete.push(touchedTile.dataset.id);
    params.deleteSlideBusinessRule(eligibleForDelete, touchedTile.dataset.id, slides);

    for (i = 0; i < slides.length; i++) {
      if (eligibleForDelete.indexOf(slides[i].dataset.id) !== -1) {
        slides[i].classList.add("deleting");
      }
    }

    if (document.getElementById("blankslidedynamic")) {
      tilelist.removeChild(document.getElementById("blankslidedynamic"));
    }

    var deletedSlides = document.getElementsByClassName("deleting")
    setTimeout(function() {
      var deletedSlidesTimemout = document.getElementsByClassName("deleting");
      for (i = 0; i < deletedSlidesTimemout.length; i++) {
        deletedSlidesTimemout[i].classList.add("gone");
      }
    }, 300);

    for (i = 0; i < deletedSlides.length; i++) {
      deletedSlides[i].classList.remove("visibletile", "savable");
    }

    visibleSlides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.visibletile")
    if (Boolean(visibleSlides.length % 2)) { //test to see if the number of slides is odd, then add a blank div to the scrollable for display purposes
      var blankDiv = document.createElement("div");
      blankDiv.className = "blankdynamictile tile visibletile";
      blankDiv.id = "blankslidedynamic";
      tilelist.appendChild(blankDiv);
      visibleSlides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.visibletile")
    }

    numOfTiles = (visibleSlides.length) / 2;
    sectionSize = numOfTiles * 400; // Establish width of the container DIV for mini-tiles
    // customlayoutsinglecontainertilelist.style.width = Math.floor(sectionSize) + 'px';

    bodyhome.classList.add("editedlayout");
    specialsavebutton.setAttribute("ontouchend", "kinesisBuilder.confirmSave()");
    //singlecustomlayoutclosebutton.setAttribute("ontouchend", "kinesisBuilder.confirmSave()");
    // menuopenbutton.setAttribute("ontouchend", "kinesisBuilder.confirmSave(event, true)");
    confirmcancelButton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteSlide()");
    confirmcancelSaveButton.setAttribute("ontouchend", "kinesisBuilder.saveDeleteSlide()");
    confirmsaveButton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteSlide()");
    confirmsaveSaveButton.setAttribute("ontouchend", "kinesisBuilder.saveDeleteSlide()");
    //menuopenbutton.addEventListener("touchend", kinesisBuilder.confirmSave, false);
  },

  cancelDeleteSlide: function() {
    var singletiles = document.getElementsByClassName("singletile"),
      visibleSlides, numOfTiles, tilelist = document.getElementById("customlayoutsinglecontainertilelist");
    //segmentscontainer.classList.remove("collapsed");
    //customlayoutscontainer.classList.remove("collapsed");
    for (i = 0; i < singletiles.length; i++) {
      singletiles[i].classList.remove("deleting", "gone");
      singletiles[i].classList.add("visibletile", "savable");
    }

    draggableElements = null;
    this.rebuildSingleLayout(tilelist.dataset.id);

    visibleSlides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.visibletile")
    if (Boolean(visibleSlides.length % 2)) { //test to see if the number of slides is odd, then add a blank div to the scrollable for display purposes
      var blankDiv = document.createElement("div");
      blankDiv.className = "blankdynamictile tile visibletile";
      blankDiv.id = "blankslidedynamic";
      tilelist.appendChild(blankDiv);
      visibleSlides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.visibletile")
    }

    numOfTiles = numOfTiles;
    sectionSize = numOfTiles * 400; // Establish width of the container DIV for mini-tiles
    customlayoutsinglecontainertilelist.style.width = Math.floor(sectionSize) + 'px';

    bodyhome.classList.remove("specialedit");
    scrollablesection.classList.remove("dragmode");
    eligibleForDelete.length = 0;

    bodyhome.classList.remove("editedlayout");
    //menuopenbutton.setAttribute("ontouchend", "mainNav.openSegmentNav()");
    specialcancelbutton.setAttribute("ontouchend", "");
    closeThisPop("confirmcancel");
    closeThisPop("confirmsave");
    //bodyhome.classList.add("editlayouts");
    editMode = false;
    kinesisBuilder.disableDraggable();
    isDraggable = false;
    draggableElements = null;
  },

  saveDeleteSlide: function() {
    var editedSlides = [],
      tilelist = document.getElementById("customlayoutsinglecontainertilelist");

    this.saveEditedCustomLayout(tilelist.dataset.id);

    if (eligibleForDelete.length > 0) {
      eligibleForDelete.length = 0;
    }
    if (editedSlides.length > 0) {
      editedSlides.length = 0;
    }
    editMode = false;
    kinesisBuilder.disableDraggable();
    isDraggable = false;
    draggableElements = null;
  },

  rebuildSingleLayout: function(num) {
    console.log("rebuild")
    var editSlidesInfoArray = parsedJSON[params.dsaID][0].savedCallFlows[num].callFlow.split(";"),
      tilelist = document.getElementById("customlayoutsinglecontainertilelist"),
      scrollablesection = document.getElementById("customlayoutsinglecontainer"),
      tileGroupButtons = document.getElementsByClassName("tilegroup");
    parsedJSON = JSON.parse(dataForDisplay);
    //Figure out how many slides per brand there are so we can add the appropriate amount of blank slides in the popup
    customlayoutsinglecontainertilelist.innerHTML = "";
    customlayoutsinglecontainertilelist.dataset.id = num;
    tileGroupButtons[Number(num)].classList.add("selectedbutton")
    for (i = 0; i < (editSlidesInfoArray.length); i++) {
      (function() {
        var slideSrc = kinesisBuilder.lookUpSlideInfo('src', editSlidesInfoArray[i]),
          slidesHTML = "",
          newContainerDiv = document.createElement("div"),
          newClickDiv = document.createElement("div"),
          newDeleteDiv = document.createElement("div"),
          target = kinesisBuilder.lookUpSlideInfo('contentLink', editSlidesInfoArray[i]).split(","),
          clickEventListner = '',
          requiredSlide = kinesisBuilder.lookUpSlideInfo('required', editSlidesInfoArray[i]).split(",");
        clickEventListner = function() {
          kinesisBuilder.homePageJumpcheck(target[0], target[1])
        };
        newDeleteDiv.className = "deleteslide";
        newDeleteDiv.setAttribute("ontouchend", "kinesisBuilder.deleteSlide(" + i + ")");
        newContainerDiv.appendChild(newDeleteDiv);
        newContainerDiv.setAttribute("data-id", editSlidesInfoArray[i]);
        newContainerDiv.setAttribute("data-required", requiredSlide);
        newContainerDiv.style.backgroundImage = "url(" + modePath + "images/" + kinesisBuilder.lookUpSlideInfo('image', editSlidesInfoArray[i].toString()) + ")";
        newContainerDiv.setAttribute("ontouchstart", "kinesisBuilder.longTap(" + num + ", this)");
        newContainerDiv.setAttribute("ontouchend", "kinesisBuilder.cancelLongTap()");
        newContainerDiv.addEventListener("touchend", clickEventListner, false);
        if (i === 0) {
          newContainerDiv.className = "singletile tile visibletile savable";
        } else {
          newContainerDiv.className = "singletile tile visibletile savable draggabletile";
        }
        customlayoutsinglecontainertilelist.appendChild(newContainerDiv);
        customlayoutsinglecontainertilelist.dataset.path = parsedJSON[params.dsaID][0].savedCallFlows[num].callFlow;
      }())
    }


    var slides = document.querySelectorAll("#customlayoutsinglecontainertilelist div.tile"),
      numOfTiles = slides.length;
    numOfTiles = numOfTiles;
    sectionSize = numOfTiles * 400; // Establish width of the container DIV for mini-tiles
    //customlayoutsinglecontainertilelist.style.width = Math.floor(sectionSize) + 'px';
  },

  saveEditedCustomLayout: function(callFlowNum) {
    var savableSlides = document.getElementsByClassName("savable");
    if (savableSlides.length !== 0) {
      var callFlowString = "";
      for (i = 0; i < savableSlides.length; i++) {
        if (savableSlides.length === i + 1) {
          callFlowString += savableSlides[i].dataset.id;
        } else {
          callFlowString += savableSlides[i].dataset.id + ";";
        }
      }

      kinesisBuilder.saveObject(callFlowNum, callFlowString);
      customlayoutsinglecontainertilelist.dataset.path = callFlowString;
      savebutton.setAttribute("ontouchend", "");
      //specialcancelbutton.setAttribute("ontouchend", "");
      confirmsaveSaveButton.setAttribute("ontouchend", "kinesisBuilder.saveDeleteSlide()");
      //bodyhome.classList.add("editlayouts");
      bodyhome.classList.remove("specialedit", "editedlayout");
      //bodyhome.classList.remove("home");
      closeThisPop("confirmsave");
      closeThisPop("confirmcancel");
      kinesisBuilder.disableDraggable();
      isDraggable = false;
      draggableElements = null;
      //this.rebuildSingleLayout(callFlowNum);
    } else {

    }
    editMode = false;
  },


  enableDisable: function() {
    if (callFlowName.value === "") {
      popupSaveButton.classList.remove("enabled");
    } else {
      popupSaveButton.classList.add("enabled");
    }
  },

  confirmSave: function(event, fromTile) {
    if (fromTile) {
      popupToggle("confirmcancel");
    } else {
      popupToggle("confirmsave");
    }
  },

  longTap: function(num, element) {
    if (!isDraggable && !pageIsScrolling) {
      longTapTimer = setTimeout(function() {
        kinesisBuilder.editLayout();
        kinesisBuilder.createDraggable(num, element);
      }, 1000);
    } else {
      clearTimeout(longTapTimer)
      return;
    }
  },

  cancelLongTap: function(num) {
    if (editMode && !isDraggable) {
      clearTimeout(longTapTimer);
    }
  },

  createDraggable: function(num, element) { //This uses the draggable library from greensock to make the various slides draggable.
    var editSlideContainer = document.getElementsByClassName("visibletile"),
      threshold = "20px",
      scrollablesection = document.getElementById("scrollablesection"),
      dropAllowed, previousBG, cannotMoveBG = "url(" + modePath + "images/cl_cannot-move-overlay.png)",
      changedBG, savableSlideContainer = document.getElementsByClassName("draggabletile"),
      noCollision;
    //specialsavebutton.setAttribute("ontouchend", "kinesisBuilder.confirmSave()");
    isDraggable = true;
    editmode = true;
    TweenMax.fromTo(element, 1, {
      scale: 1.3
    }, {
      scale: 1
    });
    scrollablesection.classList.add("dragmode");
    if (draggableElements) {
      for (i = 0; i < draggableElements.length; i++) {
        draggableElements[i].enable();
      }
    } else {
      draggableElements = Draggable.create(savableSlideContainer, {
        onDragStart: function() {
          dropAllowed = true;
        },
        onDragEnd: checkCollisions,
        onPress: function() {
          StartX = this.x;
          StartY = this.y; /*TweenMax.pauseAll()*/
        },
        onRelease: function() {
          if (noCollision) {
            TweenLite.to(this.target, .5, {
              x: StartX,
              y: StartY
            });
          }
        },
        onDrag: checkBusinessRules,
        bounds: scrollablesection,
        zIndexBoost: true
      });
    }
    // Start the inital tile layout
    kinesisBuilder.layoutTiles(savableSlideContainer);
    //Check the business rules
    function checkBusinessRules() {
      var s = savableSlideContainer.length,
        elementToSwap;
      //scrollerMain.scrollTo(scrollerMain.scrollLeft, scrollerMain.scrollTop);
      while (s--) {
        // Hit test the tiles and change their position if needed
        if (this.hitTest(editSlideContainer[s], threshold)) {
          if (params.dragAndDropBusinessRule(this.target, editSlideContainer[s], editSlideContainer)) {
            this.target.classList.remove("notallowed");
            if (changedBG) {
              previousBG = kinesisBuilder.lookUpSlideInfo('image', this.target.dataset.id)
              this.target.style.backgroundImage = 'url(' + modePath + 'images/' + previousBG + ')';
              changedBG = false;
            }
            dropAllowed = true;
            break;
          } else {
            dropAllowed = false;
            previousBG = this.target.style.backgroundImage;
            if (!changedBG) {
              this.target.style.backgroundImage = cannotMoveBG + ", " + previousBG;
              changedBG = true;
            }
            this.target.classList.add("notallowed");
          }
        } else {

        }
      }
    }

    // Run a hit test on all the tiles
    function checkCollisions() {
      var s = savableSlideContainer.length,
        elementToSwap;
      while (s--) {
        // Hit test the tiles and change their position if needed
        if (this.hitTest(savableSlideContainer[s], threshold) && dropAllowed) {
          elementToSwap = savableSlideContainer[s];
          kinesisBuilder.changePosition(this.target, savableSlideContainer[s], savableSlideContainer);

          noCollision = false;
          this.target.classList.remove("notallowed");
          confirmsaveButton.setAttribute("ontouchend", "kinesisBuilder.cancelDeleteSlide()")
          confirmsaveSaveButton.setAttribute("ontouchend", "kinesisBuilder.saveEditedCustomLayout(" + customlayoutsinglecontainertilelist.dataset.id + ")")
          // Move the tiles to their new position
          kinesisBuilder.layoutTiles(savableSlideContainer, this.target, elementToSwap);
          break;
        } else {
          kinesisBuilder.layoutTiles(savableSlideContainer, this.target, elementToSwap);
          noCollision = true;
        }
        if (changedBG) {
          previousBG = kinesisBuilder.lookUpSlideInfo('image', this.target.dataset.id)
          this.target.style.backgroundImage = 'url(' + modePath + 'images/' + previousBG + ')';
          changedBG = false;
        }
      }
      if (dropAllowed) {
        params.reorderAfterDragAndDrop(this.target, savableSlideContainer, elementToSwap);
      }
    }
  },

  disableDraggable: function() {
    scrollablesection.classList.remove("dragmode");
    if (draggableElements) {
      for (i = 0; i < draggableElements.length; i++) {
        draggableElements[i].disable();
      }
    }
  },


  killDraggable: function() {
    scrollablesection.classList.remove("dragmode");
    if (draggableElements) {
      for (i = 0; i < draggableElements.length; i++) {
        draggableElements[i].kill();
      }
    }
  },

  layoutTiles: function(array, draggedElement, elementToSwap) {
    for (i = 0; i < array.length; i++) {
      var time = 0.5;
      TweenMax.to(array[i], time, {
        x: 0,
        y: 0
      });
      array[i].setAttribute("data-Index", i);
      array[i].classList.remove("notallowed");
      if (elementToSwap) {
        //params.reorderAfterDragAndDrop(draggedElement, array, elementToSwap);
      } else {

      }
      // (Re)-index each tile
    }
  },

  changePosition: function(target1, target2, savableSlideContainer) {
    // Change position between two elements
    // This just changes the DOM structure, it doesn't actually move them visually
    // This places the elements in the correct order so that they can be
    // Indexed correctly in the layoutTiles function
    // Compare indexes to determine if tile should be inserted before or after

    if (target1.getAttribute("data-Index") > target2.getAttribute("data-Index")) {
      target1.parentNode.insertBefore(target1, target2);
    } else {
      target1.parentNode.insertBefore(target1, target2.nextSibling);
    }
    bodyhome.classList.add("editedlayout");

    specialsavebutton.setAttribute("ontouchend", "kinesisBuilder.confirmSave()");

    //kinesisBuilder.reBuildEditCallFlowOject(num);
  },

  getDataForDisplay: function() { //Method to get data from user or local storage
    if (params.devMode) {
      dataForDisplay = localStorage.getItem(params.dsaID + "savedMosaicCallFlows"); //Testing purposes, getting from localstorage
      myInsightsDataForDisplay = localStorage.getItem("MyInsights" + params.dsaID + "savedMosaicCallFlows"); //Testing purposes, getting from localstorage
      kinesisBuilder.loadDisplaySaved(dataForDisplay, myInsightsDataForDisplay);

    } else {
      com.veeva.clm.getDataForCurrentObject("Presentation", "Custom_Presentation_Field_abv__c", getPreviousJSONString);

      function getPreviousJSONString(resultFromGetDataForCurrentObjectDisplayData) {
        user_field_api_name = resultFromGetDataForCurrentObjectDisplayData.Presentation.Custom_Presentation_Field_abv__c;
        com.veeva.clm.getDataForCurrentObject("User", user_field_api_name, function() {
          assignDataForDisplay(result)
        });
      }

      function assignDataForDisplay(resultFromGetPreviousJSONStringDisplayData) {
        myInsightsDataForDisplay = localStorage.getItem("MyInsights" + params.dsaID + "savedMosaicCallFlows");
        if (resultFromGetPreviousJSONStringDisplayData.success = "true") { //User present, get it from custom field in iRep.  Have to use loose typing for some reason, otherwise this won't return correctly.
          if (resultFromGetPreviousJSONStringDisplayData.code = "1121") { //Success?  Have to use loose typing for some reason, otherwise this won't return correctly.
            dataFromStorage = resultFromGetPreviousJSONStringDisplayData.User[user_field_api_name];
            dataForDisplay = window.atob(dataFromStorage).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}"/g, "}");
            /*dataForDisplayRemovePreceedingQuotes = dataForDisplayRemoveEscapes.replace(/\"{/g,"{");
						dataForDisplayRemoveTrailingQuotes = dataForDisplayRemovePreceedingQuotes.replace(/}"/g,"}");
						dataForDisplay = dataForDisplayRemoveTrailingQuotes;*/
            kinesisBuilder.loadDisplaySaved(dataForDisplay, myInsightsDataForDisplay);
          } else { //some kind of error, get it from local storage
            dataFromStorage = localStorage.getItem(params.dsaID + "savedMosaicCallFlows");
            dataForDisplay = dataFromStorage;
            kinesisBuilder.loadDisplaySaved(dataForDisplay, myInsightsDataForDisplay);
          }
        }
      }
    }
  },

  saveObject: function(num, updatedCallFlow) { //This builds the save callflow object (which then gets turned into a string) for saving
    var callFlowName, data, firstItem = true;
    if (num !== undefined) { //coming from the edit call flow screen, get the index number of the call flow they are editing and then do stuff with it
      parsedJSONData = JSON.parse(dataForDisplay);
      if (updatedCallFlow !== undefined) {
        parsedJSONData[params.dsaID][0].savedCallFlows[num].callFlow = updatedCallFlow;
      }
      if (document.getElementById("callFlowName").value.length !== 0) { //They are changing the call flow name from the edit screen
        parsedJSONData[params.dsaID][0].savedCallFlows[num].callFlowName = document.getElementById("callFlowName").value;
        singlelayoutheadline.innerHTML = document.getElementById("callFlowName").value;
      }
      formattedData = JSON.stringify(parsedJSONData[params.dsaID][0].savedCallFlows).replace(/[\[\]']+/g, '');
      if (parsedJSONData[params.dsaID][0].savedCallFlows.length !== 0) {
        data = '{"' + params.dsaID + '":[{ "savedCallFlows" :[' + formattedData + '] }]}';
        this.saveData(data); //Pass to the save method, after running it through the method to replace the not allowed characters " and (
      } else {
        dataForDisplay = '';
        this.saveData(data); //Pass to the save method, after running it through the method to replace the not allowed characters " and (
      }
    } else { //coming from the main screen
      if (document.getElementById("callFlowName").value) {
        callFlowName = document.getElementById("callFlowName").value;
      } else {
        callFlowName = "default";
      }
      savedPaths = this.getCallflow(num);

      data = '{"' + params.dsaID + '":[{ "savedCallFlows" :[' + this.getPreviousDataString(callFlowName, savedPaths) + '] }]}';

      this.saveData(data);
    }
  },

  getPreviousDataString: function(callFlowName, savedPaths) { //This is used to insert/update the string of saved callflows.
    var previousArray, previousDataString, dsaHasSavedData;
    if (dataForDisplay) {
      parsedJSON = JSON.parse(dataForDisplay);
      if (parsedJSON.hasOwnProperty(params.dsaID)) {
        dsaHasSavedData = true;
      } else {
        dsaHasSavedData = false;
      }
    }
    if (dsaHasSavedData) {
      if (overWrite === "true") {
        parsedJSON[params.dsaID][0].savedCallFlows[saveTo].callFlowName = callFlowName;
        parsedJSON[params.dsaID][0].savedCallFlows[saveTo].callFlow = savedPaths;
        previousArray = JSON.stringify(parsedJSON[params.dsaID][0].savedCallFlows);
        previousDataString = previousArray.replace(/[\[\]']+/g, '');
        return previousDataString;
      } else {
        previousArray = JSON.stringify(parsedJSON[params.dsaID][0].savedCallFlows);
        previousDataString = previousArray.replace(/[\[\]']+/g, '') + ', {"callFlowName":"' + callFlowName + '","callFlow":"' + savedPaths + '"}';
      }
    } else {
      previousDataString = '{"callFlowName":"' + callFlowName + '","callFlow":"' + savedPaths + '"}';
    }
    return previousDataString;
  },

  getCallflow: function() { //Gets the callflow from the currently selected slides array and builds a string
    var callFlowString = "";
    for (i = 0; i < selectedSlidesInfoArray.length; i++) {
      if (selectedSlidesInfoArray.length === i + 1) {
        callFlowString += selectedSlidesInfoArray[i];
      } else {
        callFlowString += selectedSlidesInfoArray[i] + ";";
      }
    }
    return callFlowString;
  },

  saveData: function(data) { //Saves data to the user (with a fall back to local storage) so the saved callflows section can be rebuilt if the user comes back to this slide
    if (params.devMode === true) {
      localStorage.setItem(params.dsaID + "savedMosaicCallFlows", data);
      this.getDataForDisplay(); //Testing only
    } else {
      localStorage.setItem(params.dsaID + "savedMosaicCallFlows", data); //Save it to local storage as a backup
      com.veeva.clm.getDataForCurrentObject("Presentation", "Custom_Presentation_Field_abv__c", function() {
        kinesisBuilder.getPreviousJSON(result, data)
      });
    }
    exitTileSelectionMode();
  },

  getPreviousJSON: function(resultFromGetDataForCurrentObject, data) {
    user_field_api_name = resultFromGetDataForCurrentObject.Presentation.Custom_Presentation_Field_abv__c;
    com.veeva.clm.getDataForCurrentObject("User", user_field_api_name, function() {
      kinesisBuilder.getResult(result, data)
    });
  },

  getResult: function(resultFromGetPreviousJSON, data) {
    var myJSONstring = resultFromGetPreviousJSON.User[user_field_api_name];
    com.veeva.clm.getDataForCurrentObject("User", "ID", function() {
      kinesisBuilder.updateUserField(result, data)
    });
  },

  updateUserField: function(resultFromGetResult, data) {
    var otherUpdate = {};
    otherUpdate[user_field_api_name] = window.btoa(JSON.stringify(data));
    com.veeva.clm.updateRecord("User", resultFromGetResult.User.ID, otherUpdate, function() {
      kinesisBuilder.finalDisplay(result)
    });
  },

  finalDisplay: function(result) {
    kinesisBuilder.getDataForDisplay()
  },

  doNothing: function() { //testing for the callbacks
  },

  addArrayItem: function(array, slideInformation) { //Method to add slides to the selectedSlides array, called when user tapped a slide to add it and has passed through the business rules in the kinesis extended
    array.push(slideInformation);
    return array;
  },

  removeArrayItem: function(array, slideInformation) { //Method to remove slides from the selectedSlides array, called when user "re" tapped a slide to remove it
    var itemsinarray;
    while ((itemsinarray = array.indexOf(slideInformation)) !== -1) {
      array.splice(itemsinarray, 1);
    }
    return array;
  },

  lookUpSlideInfo: function(parameter, valuetofind) { //Method to look up other attributes on the tile object from TileData.js
    for (var key in tiles) {
      if (tiles[key].tileID === valuetofind) {
        switch (parameter) {
          case "title":
            return tiles[key].title;
          case "description":
            return tiles[key].description;
          case "segment":
            return tiles[key].segment;
          case "image":
            return tiles[key].image;
          case "contentLink":
            return tiles[key].contentLink;
          case "required":
            return tiles[key].required;
          case "parentTiles":
            return tiles[key].parentTiles;
          case "childTiles":
            return tiles[key].childTiles;
          default:
            return tiles[key].contentLink;
        }
      }

    }
  },

  lookUpSegmentInfo: function(parameter, valuetofind) { //Method to look up other attributes on the segment object from TileData.js
    for (var key in segments) {
      if (segments[key].segment === valuetofind) {
        switch (parameter) {
          case "segment":
            return segments[key].segment;
          case "segmentName":
            return segments[key].segmentName;
          case "segmentDescription":
            return segments[key].segmentDescription;
          case "tileOrder":
            return segments[key].tileOrder;
          default:
            return segments[key].tileOrder;
        }
      }

    }
  },

  doubleTap: function() {
    document.getElementById("logo").setAttribute("ontouchend", "kinesisBuilder.tripleTap()");
    setTimeout(function() {
      document.getElementById("logo").setAttribute("ontouchend", "kinesisBuilder.doubleTap()");
    }, 700);
  },

  tripleTap: function() {
    document.getElementById("logo").setAttribute("ontouchend", "kinesisBuilder.deleteAll()");
    setTimeout(function() {
      document.getElementById("logo").setAttribute("ontouchend", "kinesisBuilder.doubleTap()");
    }, 700);
  },

  deleteAll: function() {
    this.deleteAllUser();
    localStorage.clear();
  },

  deleteAllUser: function() {
    com.veeva.clm.getDataForCurrentObject("Presentation", "Custom_Presentation_Field_abv__c", function() {
      kinesisBuilder.getPreviousJSONForDelete(result);
    });
  },

  getPreviousJSONForDelete: function(resultFromGetDataForCurrentObjectForDelete) {
    user_field_api_name = resultFromGetDataForCurrentObjectForDelete.Presentation.Custom_Presentation_Field_abv__c;
    com.veeva.clm.getDataForCurrentObject("User", user_field_api_name, function() {
      kinesisBuilder.getResultForDelete(result)
    });
  },

  getResultForDelete: function(resultFromGetPreviousJSONForDelete) {
    var myJSONstring = resultFromGetPreviousJSONForDelete.User[user_field_api_name];
    com.veeva.clm.getDataForCurrentObject("User", "ID", function() {
      kinesisBuilder.updateUserFieldForDelete(result)
    });
  },

  updateUserFieldForDelete: function(resultFromGetResultForDelete) {
    var otherUpdate = {};
    otherUpdate[user_field_api_name] = '';
    com.veeva.clm.updateRecord("User", resultFromGetResultForDelete.User.ID, otherUpdate, function() {
      kinesisBuilder.finalDisplay(result)
    });
  }
};

//Utility functions

//Restrict input to just alpha numeric
var specialKeys = [];
specialKeys.push(8); //Backspace
specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(32); //Space
specialKeys.push(37); //Left
specialKeys.push(39); //Right
function IsAlphaNumeric(e) {
  var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
  var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode === 32 || keyCode === 40 || keyCode === 41 || keyCode === 58 || keyCode === 45 || keyCode === 46 || keyCode === 47 || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
  return ret;
}

function enterTileSelectionMode() {
  //set selection flag ON
  isSelectionMode = true;
  bodyhome.classList.add("selectslides");
  bodyhome.classList.remove("home");
  closeAllPops();
}

function exitTileSelectionMode() {
  var allSlides = document.querySelectorAll("ul.tile-list li");
  //set selection flag OFF
  isSelectionMode = false;
  for (i = 0; i < allSlides.length; i++) {
    allSlides[i].classList.remove("selectedTab");
  }
  setTimeout(function() { //run it again, for some reason it doesn't get all of the elements the first time
    for (i = 0; i < allSlides.length; i++) {
      allSlides[i].classList.remove("selectedTab");
    }
  }, 100);
  //toggleCustomLayoutsButton.setAttribute("ontouchend", "kinesisBuilder.toggleCustomLayouts()");
  newlayoutbutton.classList.remove("enabled");
  document.getElementById("callFlowName").value = "";
  document.getElementById("savecallflowpopup").classList.remove("editpopup", "newpopup");
  //document.getElementById("addtoslidesbutton").classList.remove("blue");
  bodyhome.classList.add("home");
  //tilelist.classList.remove("hidden")
  bodyhome.classList.remove("cancel", "selectslides", "deletelayouts", "editedlayout");
  callFlowName.blur();
  kinesisBuilder.enableDisable();
  closeAllPops();

}
