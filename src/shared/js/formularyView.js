(function(window) {
    'use strict';

    var graphView = document.getElementById('graph');
    var formularyView = document.getElementById('formulary');
    var body = document.body;
    var content = document.getElementById('content');
    var stateSelect = document.getElementById('state');
    var countySelect = document.getElementById('county');
    var plansWrapper = document.getElementById('plans');
    var countyName = document.getElementById('countyName');
    var footerCopy = document.getElementById('footerCopy');

    function truncate(n, useWordBoundary){
        if (this.length <= n) { return this; }
        var subString = this.substr(0, n-1);
        return (useWordBoundary
           ? subString.substr(0, subString.lastIndexOf(' '))
           : subString) + '...';
    }

    // function getJSON(url, callback) {
    //     setTimeout(function() {
    //         var xhr = new XMLHttpRequest();
    //
    //         xhr.onreadystatechange = function() {
    //             if (xhr.readyState == 4 && xhr.status == '200') {
    //                 callback(null, xhr.response);
    //                 console.log(xhr.response);
    //             } else {
    //                 callback(status);
    //             }
    //         }
    //
    //         xhr.open('get', url, true);
    //         xhr.responseType = 'json';
    //         xhr.send();
    //
    //     }, 500);
    // }

    function populateStateSelect(data) {
        stateSelect.options.length = 0;

        data.forEach(function(d) {
            var option = document.createElement('option');
            option.text = d.name;
            option.value = d.abbreviation;
            option.disabled = d.disabled;

            stateSelect.appendChild(option);
        });

        return getCounties();
    }

    function populateCountySelect(data) {
        countySelect.options.length = 0;

        data.forEach(function(d) {
            var option = document.createElement('option');
            option.text = d.name;
            option.value = d.name;
            option.disabled = d.disabled;

            countySelect.appendChild(option);
        });

        return getPlans();
    }

    function populatePlans(data) {
        plansWrapper.innerHTML = '<li class="title">Insurance Plan<span class="col2">Formulary Status</span><span class="col3">Average Co-Pay</span></li>';

        data.forEach(function(d) {
            var li = document.createElement('li');
            var name = truncate.apply(d.name, [30, true]);
            li.innerHTML = name + '<span class="col2">' + d.score + '</span><span class="col3">$' + d.copay + '</span>';
            plansWrapper.appendChild(li);
        });
    }

    function updateCountyName(county) {
        countyName.innerHTML = county;
    }

    function getStates() {
        // getJSON('./js/data/states.json',
        //     function(err, data) {
        //         if (err != null) {
        //             console.log(err);
        //         } else {
        //             populateStateSelect(data);
        //         }
        //     });

        setTimeout(function() {
            populateStateSelect(window.FORMULARY_DATA.STATES);
        }, 100);
    }

    function getCounties() {
        var st = stateSelect.value;

        if (st && st === 'NY') {
            // getJSON('./js/data/newyork.json',
            //     function(err, data) {
            //         if (err != null) {
            //             console.log(err);
            //         } else {
            //             populateCountySelect(data);
            //         }
            //     });

            setTimeout(function() {
                populateCountySelect(window.FORMULARY_DATA.NEW_YORK);
            }, 100);
        } else {
            // getJSON('./js/data/newjersey.json',
            //     function(err, data) {
            //         if (err != null) {
            //             console.log(err);
            //         } else {
            //             populateCountySelect(data);
            //         }
            //     });

            setTimeout(function() {
                populateCountySelect(window.FORMULARY_DATA.NEW_JERSEY);
            }, 100);
        }
    }

    function getPlans() {
        var pl = countySelect.value;

        if (pl && pl === 'Bronx') {
            // getJSON('./js/data/bronx.json',
            //     function(err, data) {
            //         if (err != null) {
            //             console.log(err);
            //         } else {
            //             populatePlans(data);
            //         }
            //     });

            setTimeout(function() {
                populatePlans(window.FORMULARY_DATA.BRONX);
            }, 100);
        } else {
            // getJSON('./js/data/summerset.json',
            //     function(err, data) {
            //         if (err != null) {
            //             console.log(err);
            //         } else {
            //             populatePlans(data);
            //         }
            //     });

            setTimeout(function() {
                populatePlans(window.FORMULARY_DATA.SUMMERSET);
            }, 100);
        }

        return updateCountyName(pl);
    }

    function showView(view) {
        switch(view) {
            case 'formulary':
                console.log('portrait');
                graphView.classList.remove('active');
                graphView.classList.add('inactive');
                formularyView.classList.remove('inactive');
                formularyView.classList.add('active');
                body.classList.add('portrait');
                content.classList.add('portrait');
                footerCopy.classList.remove('active');
                break;
            default:
                console.log('landscape');
                graphView.classList.remove('inactive');
                graphView.classList.add('active');
                formularyView.classList.remove('active');
                formularyView.classList.add('inactive');
                body.classList.remove('portrait');
                content.classList.remove('portrait');
                footerCopy.classList.add('active');
                break;
        }
    }

    function onOrientationChange() {
        // showView('graph');
        switch(window.orientation) {
            case -90:
            case 90:
                showView('graph');
                break;
            default:
                showView('formulary');
                window.chartView.closeStudy();
                break;
        }
    }

    window.addEventListener('orientationchange', onOrientationChange);
    stateSelect.addEventListener('change', getCounties, false);
    countySelect.addEventListener('change', getPlans, false);

    // Added back in chartView.js
   // document.removeEventListener("touchstart", window.pharmaSwipe.detectSwipeStart);
   // document.removeEventListener("touchmove", window.pharmaSwipe.detectSwipe);

    onOrientationChange();
    getStates();

    window.nextUrl = "summary-view.zip";
    window.prevUrl = "patient-profile-view.zip";

}(window));
