(function(window) {
    'use strict';

    var FORMULARY_DATA = {
        STATES: [
            {
                "name": "Alabama",
                "abbreviation": "AL",
                "disabled": true
            },
            {
                "name": "Alaska",
                "abbreviation": "AK",
                "disabled": true
            },
            {
                "name": "American Samoa",
                "abbreviation": "AS",
                "disabled": true
            },
            {
                "name": "Arizona",
                "abbreviation": "AZ",
                "disabled": true
            },
            {
                "name": "Arkansas",
                "abbreviation": "AR",
                "disabled": true
            },
            {
                "name": "California",
                "abbreviation": "CA",
                "disabled": true
            },
            {
                "name": "Colorado",
                "abbreviation": "CO",
                "disabled": true
            },
            {
                "name": "Connecticut",
                "abbreviation": "CT",
                "disabled": true
            },
            {
                "name": "Delaware",
                "abbreviation": "DE",
                "disabled": true
            },
            {
                "name": "District of Columbia",
                "abbreviation": "DC",
                "disabled": true
            },
            {
                "name": "Federated States of Micronesia",
                "abbreviation": "FM",
                "disabled": true
            },
            {
                "name": "Florida",
                "abbreviation": "FL",
                "disabled": true
            },
            {
                "name": "Georgia",
                "abbreviation": "GA",
                "disabled": true
            },
            {
                "name": "Guam",
                "abbreviation": "GU",
                "disabled": true
            },
            {
                "name": "Hawaii",
                "abbreviation": "HI",
                "disabled": true
            },
            {
                "name": "Idaho",
                "abbreviation": "ID",
                "disabled": true
            },
            {
                "name": "Illinois",
                "abbreviation": "IL",
                "disabled": true
            },
            {
                "name": "Indiana",
                "abbreviation": "IN",
                "disabled": true
            },
            {
                "name": "Iowa",
                "abbreviation": "IA",
                "disabled": true
            },
            {
                "name": "Kansas",
                "abbreviation": "KS",
                "disabled": true
            },
            {
                "name": "Kentucky",
                "abbreviation": "KY",
                "disabled": true
            },
            {
                "name": "Louisiana",
                "abbreviation": "LA",
                "disabled": true
            },
            {
                "name": "Maine",
                "abbreviation": "ME",
                "disabled": true
            },
            {
                "name": "Marshall Islands",
                "abbreviation": "MH",
                "disabled": true
            },
            {
                "name": "Maryland",
                "abbreviation": "MD",
                "disabled": true
            },
            {
                "name": "Massachusetts",
                "abbreviation": "MA",
                "disabled": true
            },
            {
                "name": "Michigan",
                "abbreviation": "MI",
                "disabled": true
            },
            {
                "name": "Minnesota",
                "abbreviation": "MN",
                "disabled": true
            },
            {
                "name": "Mississippi",
                "abbreviation": "MS",
                "disabled": true
            },
            {
                "name": "Missouri",
                "abbreviation": "MO",
                "disabled": true
            },
            {
                "name": "Montana",
                "abbreviation": "MT",
                "disabled": true
            },
            {
                "name": "Nebraska",
                "abbreviation": "NE",
                "disabled": true
            },
            {
                "name": "Nevada",
                "abbreviation": "NV",
                "disabled": true
            },
            {
                "name": "New Hampshire",
                "abbreviation": "NH",
                "disabled": true
            },
            {
                "name": "New Jersey",
                "abbreviation": "NJ",
                "disabled": false
            },
            {
                "name": "New Mexico",
                "abbreviation": "NM",
                "disabled": true
            },
            {
                "name": "New York",
                "abbreviation": "NY",
                "disabled": false
            },
            {
                "name": "North Carolina",
                "abbreviation": "NC",
                "disabled": true
            },
            {
                "name": "North Dakota",
                "abbreviation": "ND",
                "disabled": true
            },
            {
                "name": "Northern Mariana Islands",
                "abbreviation": "MP",
                "disabled": true
            },
            {
                "name": "Ohio",
                "abbreviation": "OH",
                "disabled": true
            },
            {
                "name": "Oklahoma",
                "abbreviation": "OK",
                "disabled": true
            },
            {
                "name": "Oregon",
                "abbreviation": "OR",
                "disabled": true
            },
            {
                "name": "Palau",
                "abbreviation": "PW",
                "disabled": true
            },
            {
                "name": "Pennsylvania",
                "abbreviation": "PA",
                "disabled": true
            },
            {
                "name": "Puerto Rico",
                "abbreviation": "PR",
                "disabled": true
            },
            {
                "name": "Rhode Island",
                "abbreviation": "RI",
                "disabled": true
            },
            {
                "name": "South Carolina",
                "abbreviation": "SC",
                "disabled": true
            },
            {
                "name": "South Dakota",
                "abbreviation": "SD",
                "disabled": true
            },
            {
                "name": "Tennessee",
                "abbreviation": "TN",
                "disabled": true
            },
            {
                "name": "Texas",
                "abbreviation": "TX",
                "disabled": true
            },
            {
                "name": "Utah",
                "abbreviation": "UT",
                "disabled": true
            },
            {
                "name": "Vermont",
                "abbreviation": "VT",
                "disabled": true
            },
            {
                "name": "Virgin Islands",
                "abbreviation": "VI",
                "disabled": true
            },
            {
                "name": "Virginia",
                "abbreviation": "VA",
                "disabled": true
            },
            {
                "name": "Washington",
                "abbreviation": "WA",
                "disabled": true
            },
            {
                "name": "West Virginia",
                "abbreviation": "WV",
                "disabled": true
            },
            {
                "name": "Wisconsin",
                "abbreviation": "WI",
                "disabled": true
            },
            {
                "name": "Wyoming",
                "abbreviation": "WY",
                "disabled": true
            }
        ],

        NEW_YORK: [
            {
                "code": "36001",
                "name": "Albany",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36003",
                "name": "Allegany",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36005",
                "name": "Bronx",
                "stateCode": "NY",
                "disabled": false
            },
            {
                "code": "36007",
                "name": "Broome",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36009",
                "name": "Cattaraugus",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36011",
                "name": "Cayuga",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36013",
                "name": "Chautauqua",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36015",
                "name": "Chemung",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36017",
                "name": "Chenango",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36019",
                "name": "Clinton",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36021",
                "name": "Columbia",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36023",
                "name": "Cortland",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36025",
                "name": "Delaware",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36027",
                "name": "Dutchess",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36029",
                "name": "Erie",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36031",
                "name": "Essex",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36033",
                "name": "Franklin",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36035",
                "name": "Fulton",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36037",
                "name": "Genesee",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36039",
                "name": "Greene",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36041",
                "name": "Hamilton",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36043",
                "name": "Herkimer",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36045",
                "name": "Jefferson",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36047",
                "name": "Kings",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36049",
                "name": "Lewis",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36051",
                "name": "Livingston",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36053",
                "name": "Madison",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36055",
                "name": "Monroe",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36057",
                "name": "Montgomery",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36059",
                "name": "Nassau",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36061",
                "name": "New York",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36063",
                "name": "Niagara",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36065",
                "name": "Oneida",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36067",
                "name": "Onondaga",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36069",
                "name": "Ontario",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36071",
                "name": "Orange",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36073",
                "name": "Orleans",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36075",
                "name": "Oswego",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36077",
                "name": "Otsego",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36079",
                "name": "Putnam",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36081",
                "name": "Queens",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36083",
                "name": "Rensselaer",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36085",
                "name": "Richmond",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36087",
                "name": "Rockland",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36089",
                "name": "Saint Lawrence",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36091",
                "name": "Saratoga",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36093",
                "name": "Schenectady",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36095",
                "name": "Schoharie",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36097",
                "name": "Schuyler",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36099",
                "name": "Seneca",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36101",
                "name": "Steuben",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36103",
                "name": "Suffolk",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36105",
                "name": "Sullivan",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36107",
                "name": "Tioga",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36109",
                "name": "Tompkins",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36111",
                "name": "Ulster",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36113",
                "name": "Warren",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36115",
                "name": "Washington",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36117",
                "name": "Wayne",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36119",
                "name": "Westchester",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36121",
                "name": "Wyoming",
                "stateCode": "NY",
                "disabled": true
            },
            {
                "code": "36123",
                "name": "Yates",
                "stateCode": "NY",
                "disabled": true
            }
        ],

        NEW_JERSEY: [
            {
                "code": "34001",
                "name": "Atlantic",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34003",
                "name": "Bergen",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34005",
                "name": "Burlington",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34007",
                "name": "Camden",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34009",
                "name": "Cape May",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34011",
                "name": "Cumberland",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34013",
                "name": "Essex",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34015",
                "name": "Gloucester",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34017",
                "name": "Hudson",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34019",
                "name": "Hunterdon",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34021",
                "name": "Mercer",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34023",
                "name": "Middlesex",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34025",
                "name": "Monmouth",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34027",
                "name": "Morris",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34029",
                "name": "Ocean",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34031",
                "name": "Passaic",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34033",
                "name": "Salem",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34035",
                "name": "Somerset",
                "stateCode": "NJ",
                "disabled": false
            },
            {
                "code": "34037",
                "name": "Sussex",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34039",
                "name": "Union",
                "stateCode": "NJ",
                "disabled": true
            },
            {
                "code": "34041",
                "name": "Warren",
                "stateCode": "NJ",
                "disabled": true
            }
        ],

        BRONX: [
            {
                "rank": 1,
                "name": "Amida Care",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "27"
            },
            {
                "rank": 2,
                "name": "Large Regional Payer",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "79"
            },
            {
                "rank": 3,
                "name": "UnitedHealthcare of New York Inc",
                "channel": "Medicare",
                "score": "Preferred brand",
                "copay": "36"
            },
            {
                "rank": 4,
                "name": "HIP Health Plan of New York",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "20"
            },
            {
                "rank": 5,
                "name": "UnitedHealthcare Oxford Health Plan of New York Inc",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "35"
            }
        ],

        SUMMERSET: [
            {
                "rank": 1,
                "name": "Horizon BCBS of New Jersey",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "35"
            },
            {
                "rank": 2,
                "name": "Large Regional Payer",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "20"
            },
            {
                "rank": 3,
                "name": "UnitedHealthcare of New Jersey Inc",
                "channel": "Medicare",
                "score": "Preferred brand",
                "copay": "36"
            },
            {
                "rank": 4,
                "name": "Large Regional Payer",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "79"
            },
            {
                "rank": 5,
                "name": "UnitedHealthcare of New Jersey Inc",
                "channel": "Commercial",
                "score": "Preferred brand",
                "copay": "27"
            }
        ]

    };

    return window.FORMULARY_DATA = FORMULARY_DATA;

}(window));
