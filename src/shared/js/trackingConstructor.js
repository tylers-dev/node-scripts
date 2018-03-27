var segment = sessionStorage.getItem("segmentCurrentlyIn"), segmentAbreviation, pageTracking;

switch(segment) {
    case "home":
        segmentAbreviation = "DEF";
        break;
    case "Segment1":
        segmentAbreviation = "SE1";
        break;
    case "Segment2":
        segmentAbreviation = "SE2";
        break;
    case "Segment3":
        segmentAbreviation = "SE3";
        break;
    case "custom":
        segmentAbreviation = "CUS";
        break;
    default:
        segmentAbreviation = "DEF";
}

pageTracking = "AND_DSA_" + segmentAbreviation + "_" + document.getElementsByTagName("body")[0].dataset.trackingabbreviation;
client.track('', pageTracking, true);
console.log(pageTracking)

function buildTracking(val){
    var trackingValue = "AND_DSA_" + segmentAbreviation + "_"  + document.getElementsByTagName("body")[0].dataset.trackingabbreviation + "_" +val
    client.track('', trackingValue, true);
    console.log(trackingValue)
}