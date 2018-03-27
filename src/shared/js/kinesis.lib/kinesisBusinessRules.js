 var kinesisBuilderBusinessRules = {
    addSlideBusinessRule: function(callFlowToSaveTo, existingcallFlow){
        var requiredTilesArray = [];
        for(i=0; i < tiles.length; i++){
            if(tiles[i].required === "true"){//Find all the required slides from the tiles object
                requiredTilesArray.push(tiles[i]);
            }
        }
        
        if(existingcallFlow){
			var existingSlides = existingcallFlow.split(";");//split the existing slides so we can iterate over them later
			//splice the selectedSlidesArray into the existing slides
			for (i=0; i<(selectedSlidesInfoArray.length); i++) {
				if(existingSlides.indexOf(selectedSlidesInfoArray[i]) === -1){
					existingSlides.push(selectedSlidesInfoArray[i]);
				}
			}
			selectedSlidesInfoArray = existingSlides;
			
			
			/*for (i=0; i<(existingSlides.length); i++) {
				if(selectedSlidesInfoArray)
				selectedSlidesInfoArray.splice(i, 0, existingSlides[i]);
			}*/
			
			for(i=0; i<requiredTilesArray.length; i++) {//Splice the required tiles into the beginning of the selectedSlidesArray, removing any the user already selected so we can re-add them in the correct order
				if(selectedSlidesInfoArray.indexOf(tiles[i].tileID) !== -1){
					kinesisBuilder.removeArrayItem(selectedSlidesInfoArray, tiles[i].tileID);
				}
				selectedSlidesInfoArray.splice(i, 0, requiredTilesArray[i].tileID);
			}
			
			for(i=0; i<selectedSlidesInfoArray.length; i++) {
				var parentTiles = kinesisBuilder.lookUpSlideInfo('parentTiles', selectedSlidesInfoArray[i]);
				if(parentTiles !== "none"){//If the user selected a slide that has parent tiles, add those parent tiles if they aren't already in the selectedSlidesArray first then add the child
					parentTilesArray = parentTiles.split(",");
					for(j=0; j < parentTilesArray.length; j++){
						if(selectedSlidesInfoArray[i] !=="6"){
							if (selectedSlidesInfoArray.indexOf(parentTilesArray[j]) === -1){
								selectedSlidesInfoArray.splice(i, 0, parentTilesArray[j]);
							}
						}
					}
				}
			}
            
            //Now replace the existing callflow using the callFlowToSaveTo
            kinesisBuilder.saveObject(callFlowToSaveTo, kinesisBuilder.getCallflow());

        } else {
            for(i=0; i<requiredTilesArray.length; i++) {//Splice the required tiles into the beginning of the selectedSlidesArray, removing any the user already selected so we can re-add them in the correct order
                if(selectedSlidesInfoArray.indexOf(tiles[i].tileID) !== -1){
                    kinesisBuilder.removeArrayItem(selectedSlidesInfoArray, tiles[i].tileID);
                }
                selectedSlidesInfoArray.splice(i, 0, requiredTilesArray[i].tileID);
            }
                
            for(i=0; i<selectedSlidesInfoArray.length; i++) {
                var parentTiles = kinesisBuilder.lookUpSlideInfo('parentTiles', selectedSlidesInfoArray[i]);
                if(parentTiles !== "none"){//If the user selected a slide that has parent tiles, add those parent tiles if they aren't already in the selectedSlidesArray first then add the child
                    parentTilesArray = parentTiles.split(",");
                    for(j=0; j < parentTilesArray.length; j++){
                        if (selectedSlidesInfoArray.indexOf(parentTilesArray[j]) === -1){
                            selectedSlidesInfoArray.splice(i, 0, parentTilesArray[j]);
                        }
                    }
                }
            }
        }
    },
    
    deleteSlideBusinessRule: function(eligibleForDelete, touchedslide, slides) {
        console.log("checking business rules");
        
        var childTiles = kinesisBuilder.lookUpSlideInfo('childTiles', touchedslide), childTilesArray=[];
        eligibleForDelete.splice(0, 0, touchedslide);
        if(childTiles !== "none"){//If the user selected a slide that has child tiles, delete those child tiles if they are already in the slides
            childTilesArray = childTiles.split(",");
            for(j=0; j < childTilesArray.length; j++){
                //Check to see if the slide id from the childTilesArray is present in the slides array that got passed in
                for(g=0; g < slides.length; g++){
                    if(slides[g].dataset.id === childTilesArray[j]){
                        eligibleForDelete.splice(i, 0, childTilesArray[j]);
                        console.log("checking for children")
                    }   
                }
            }
            return eligibleForDelete
        }
    },
    
    dragAndDropBusinessRule: function(slide, droptarget, editSlideContainer) {
        var isRequiredTileDrop = kinesisBuilder.lookUpSlideInfo('required', droptarget.dataset.id), isRequiredTileDrag = kinesisBuilder.lookUpSlideInfo('required', slide.dataset.id), parentTiles = kinesisBuilder.lookUpSlideInfo('parentTiles', slide.dataset.id).split(","), idArray=[], draggedTileIndex, highestParentIndex, ceilingIndex;
		
		//Logic for parent/child.  User cannot drag a child before it's parent, they have to reorder the parent to reorder the child
		//Find the index in the current layout for the tile being dragged
		//First we need an array of all the tile ids to compare against
		for(i=0; i<editSlideContainer.length; i++){
			idArray.push(editSlideContainer[i].dataset.id)
		}
		//Next, we need to find where the highest parent tile is for the dragged tile
		//NEEDS MORE WORK, ONLY FIND THE ONE PARENT FOR ANDRGEL CURRENTLY.  TILES CAN HAVE MULTIPLE PARENTS
		for(i=0; i<parentTiles.length; i++){
			highestParentIndex = idArray.indexOf(parentTiles[i])		
		}
		dropTargetIndex = idArray.indexOf(droptarget.dataset.id)
		
		if(highestParentIndex > dropTargetIndex) {
			ceilingIndex = false;
		} else {
			ceilingIndex = true;
		}
		
		
		if(isRequiredTileDrop === "true" || isRequiredTileDrag ==="true" || parentTiles.indexOf(droptarget.dataset.id) !== -1 || !ceilingIndex ) {
			return false	
		} else {
			return true
		}
    },
	
	reorderAfterDragAndDrop: function(draggedSlide, savableSlideContainer, elementToSwap) {
		var childTilesArray=[], childTiles = kinesisBuilder.lookUpSlideInfo('childTiles', draggedSlide.dataset.id), arr = Array.prototype.slice.call(savableSlideContainer), parentTilesArray=[], parentTiles = kinesisBuilder.lookUpSlideInfo('parentTiles', draggedSlide.dataset.id);
		if(childTiles !== "none"){//If the user selected a slide that has child tiles, move the child tiles after the reordered parent
		console.log("running top")
			childTilesArray = childTiles.split(",");
			if(Number(draggedSlide.dataset.index) === (savableSlideContainer.length - 1)){//User dragged tile to last spot, we need to move it and add the child slides after it
				var alreadyMoved;
				console.log("First")
				for(j=0; j < childTilesArray.length; j++){
					//var floorTileIndex =  (savableSlideContainer.length - childTilesArray.length);
					var floorTileIndex =  (savableSlideContainer.length - childTilesArray.length)-1; 
					kinesisBuilder.changePosition(savableSlideContainer[arr.indexOf(draggedSlide)], savableSlideContainer[floorTileIndex - j + 1]);//Move the dragged tile to the lowest index to allow for the children to be moved after it
					for(g=0; g < savableSlideContainer.length; g++){
						kinesisBuilder.layoutTiles(savableSlideContainer);
						if(savableSlideContainer[g].dataset.id === childTilesArray[j]){
							kinesisBuilder.changePosition(savableSlideContainer[g], savableSlideContainer[floorTileIndex + j+1]);
						}	
					}
					
				} 
			} else {//User dragged somewhere that is not the last tile in the layout
			console.log("second")
				for(j=0; j < childTilesArray.length; j++){
					//Check to see if the slide id from the childTilesArray is present in the slides array that got passed in
					for(g=0; g < savableSlideContainer.length; g++){
						if(draggedSlide.dataset.index > elementToSwap.dataset.index){
							childIndex = 0;
						} else {
							childIndex = j + 1;	
						}
						if(savableSlideContainer[g].dataset.id === childTilesArray[j]){
							kinesisBuilder.changePosition(savableSlideContainer[g], savableSlideContainer[arr.indexOf(draggedSlide) + childIndex]);
						}
					}
				}
				kinesisBuilder.layoutTiles(savableSlideContainer);
			}
			return false
		}
	}
}