(function(window) {
    'use strict';

    var chart = document.getElementById('chart');
    var chartEnd = document.getElementById('chartEnd');
    var fill = document.getElementById('fill');
    var guideWrap = document.getElementById('guideWrap');
    var guide = document.getElementById('guide');
    var studyDesign = document.getElementById('studyDesign');
    var studyDesignOverlay = document.getElementById('studyDesignOverlay')
    var studyDesignClose = document.getElementById('studyDesignClose');

    var guideWrapWidth = guideWrap.offsetWidth;
    var chartLeft = chart.offsetLeft;
    var guideWrapLeft = guideWrap.offsetLeft;
    var guideOffsetLeft = chartLeft + guideWrapLeft;


    studyDesign.addEventListener('touchstart', launchStudy, false);
    studyDesignClose.addEventListener('touchstart', closeStudy, false);
    chart.addEventListener('touchstart', startFill, false);
    chart.addEventListener('touchend', stopFill, false);

    function launchStudy() {
        studyDesignOverlay.classList.add('active');
    }

    function closeStudy() {
        studyDesignOverlay.classList.remove('active');
    }

    function startFill(evt) {
        fill.style.width = '0px';
        guideWrap.classList.remove('full');
        chartEnd.classList.remove('grow');
        chart.addEventListener('touchmove', moveFill, false);
    }

    function moveFill(evt) {
        if (event.touches.length == 1) {
            var touch = event.touches[0];
            var position = touch.pageX - guideOffsetLeft;

            if (position >= 0 && position <= guideWrapWidth) {
                guide.style.left = (position) + 'px';
                fill.style.width = (position) + 'px';

                // console.log('Width:  ' + position + 'px');
            }
        }
    }

    function stopFill() {
        chart.removeEventListener('touchmove', moveFill);
        chart.removeEventListener('touchstart', startFill);
        chart.removeEventListener('touchend', stopFill);
        fill.classList.add('activated');

        setTimeout(function() {
            fill.style.width = '100%';
            guide.style.left = '541px';

            // setTimeout(function() {
            //     guideWrap.classList.add('full');
            //     chartEnd.classList.add('grow');
            // }, 750);

        }, 100);

      //  document.addEventListener("touchstart", pharmaSwipe.detectSwipeStart, false);
      //  document.addEventListener("touchmove", pharmaSwipe.detectSwipe, false);
    }

    var chartView = {
        closeStudy: function() {
            closeStudy();
        }
    }

    return window.chartView = chartView;

}(window));
