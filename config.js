var config = {
    "CLM_PRESENTATIONS": [{
        "SLIDES": [{
            "id": 0,
            "name": "Standalone-GluVivaKinesis-efficacy"
        }, {
            "id": 1,
            "name": "Standalone-GluVivaKinesis-formulary"
        }, {
            "id": 2,
            "name": "Standalone-GluVivaKinesis-home"
        }, {
            "id": 3,
            "name": "Standalone-GluVivaKinesis-injectionsites"
        }, {
            "id": 4,
            "name": "Standalone-GluVivaKinesis-overview"
        }, {
            "id": 5,
            "name": "Standalone-GluVivaKinesis-patientprofiles"
        }, {
            "id": 6,
            "name": "Standalone-GluVivaKinesis-summary"
        }, 
		 {
            "id": 7,
            "name": "Standalone-GluVivaKinesis-aviquiz"
        },
		{
            "name": "shared",
            "zipName": "StandaloneGluVivaVeevaSummit-shared-resources"
        }]
    }],
    "BUILD": {},
    "DEPLOY": {},
    "CSV": {
        "all_fields": {},
        "presentation_fields": {},
        "slide_fields": {}
    }
}
try {
    module.exports = {
        config: config
    }
} catch (e) {}
