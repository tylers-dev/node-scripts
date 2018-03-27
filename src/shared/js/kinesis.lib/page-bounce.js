/*nobounce*/
document.ontouchmove = function(e){
    event.preventDefault();
};
var scrollableDivs = document.getElementsByClassName("scrollable");
for (var i = 0; i < scrollableDivs.length; i++ ) {
    var y = 0;
    var oneTouch, yPlus;
    scrollableDivs[i].addEventListener('touchstart', function(e) {
        y = event.touches[0].screenY;
        oneTouch = (event.touches.length === 1) ? true : false;  //Good place for a ternary operator, equivalent if/else is listed below.
    }, false)
    scrollableDivs[i].addEventListener('touchmove', function(e){
        yPlus = event.touches[0].screenY;
        if (yPlus > y  && this.scrollTop === 0 || y > yPlus && this.scrollTop === (this.scrollHeight - this.offsetHeight)) {
            return false;
        } else {
            if (oneTouch === true) {
                event.stopPropagation();
            }
        }
    }, false)
}

var horizontalScrollableDivs = document.getElementsByClassName("horizontalscrollable");
for (var i = 0; i < horizontalScrollableDivs.length; i++ ) {
    var x = 0;
    var oneTouch, xPlus;
    horizontalScrollableDivs[i].addEventListener('touchstart', function(e) {
        x = event.touches[0].screenX;
        oneTouch = (event.touches.length === 1) ? true : false;  //Good place for a ternary operator, equivalent if/else is listed below.
    }, false)
    horizontalScrollableDivs[i].addEventListener('touchmove', function(e){
        xPlus = event.touches[0].screenX;
        if (xPlus > x  && this.scrollLeft === 0 || x > xPlus && this.scrollLeft === (this.scrollWidth - this.offsetWidth)) {
            return false;
        } else {
            if (oneTouch === true) {
                event.stopPropagation();
            }
        }
    }, false)
}