var tiles = [
        {
            "tileID": "1",
            "title": "Overview",
            "description": "Overview",
            "segment": "white",
            "image": "tile-circle-overview.png",
            "contentLink": "Standalone-GluVivaKinesis-overview.zip, StandaloneGluVivaKinesisSummitExample",
            "required": "true",
            "parentTiles": "none",
            "childTiles": "none"
        },
        {
            "tileID": "2",
            "title": "Efficacy",
            "description": "Efficacy",
            "segment": "white",
            "image": "tile-circle-efficacy.png",
            "contentLink": "Standalone-GluVivaKinesis-efficacy.zip, StandaloneGluVivaKinesisSummitExample",
            "required": "false",
            "parentTiles": "3",
            "childTiles": "none"
        },
        {
            "tileID": "3",
            "title": "Patient Profiles",
            "description": "Patient Profiles",
            "segment": "white",
            "image": "tile-circle-patientprofiles.png",
            "contentLink": "Standalone-GluVivaKinesis-patientprofiles.zip, StandaloneGluVivaKinesisSummitExample",
            "required": "false",
            "parentTiles": "none",
            "childTiles": "none"
        },
        {
            "tileID": "4",
            "title": "Injection Sites",
            "description": "Injection Sites",
            "segment": "white",
            "image": "tile-circle-injectionsites.png",
            "contentLink": "Standalone-GluVivaKinesis-injectionsites.zip, StandaloneGluVivaKinesisSummitExample",
            "required": "false",
            "parentTiles": "none",
            "childTiles": "none"
        },
		{
            "tileID": "5",
            "title": "Formulary",
            "description": "Formulary",
            "segment": "white",
            "image": "tile-circle-formulary.png",
            "contentLink": "Standalone-GluVivaKinesis-formulary.zip, StandaloneGluVivaKinesisSummitExample",
            "required": "false",
            "parentTiles": "none",
            "childTiles": "none"
        },
		{
            "tileID": "6",
            "title": "Summary",
            "description": "Summary",
            "segment": "white",
            "image": "tile-circle-summary.png",
            "contentLink": "Standalone-GluVivaKinesis-summary.zip, StandaloneGluVivaKinesisSummitExample",
            "required": "false",
            "parentTiles": "none",
            "childTiles": "none"
        },
		{
            "tileID": "7",
            "title": "New Efficacy Tile",
            "description": "New Efficacy Tile",
            "segment": "white",
            "image": "tile-circle-newefficacytile.png",
            "contentLink": "Standalone-GluVivaKinesis-aviquiz.zip, StandaloneGluVivaKinesisSummitExample",
            "required": "false",
            "parentTiles": "none",
            "childTiles": "none"
        }
   ];
    
var segments = [
        {   "segment": "home",
            "segmentName": "Default",
			"segmentDescription": "Default",
            "tileOrder" : [ 1, 7, 3, 4, 5, 6 ]
        },
        {   "segment": "long",
            "segmentName": "longcall",
			"segmentDescription": "longcall",
            "tileOrder" : [ 1, 7, 3, 4, 5, 6 ]
        },
                  
        {  "segment": "short",
           "segmentName": "shortcall",
		   "segmentDescription": "shortcall",
           "tileOrder" : [ 1, 5, 6 ]
        }
];
    