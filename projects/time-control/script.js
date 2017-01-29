d3.select("svg").remove(); // svg not used in test

function userEvent(ndex, params) {
    var id = params[0],
        boxClass = params[1] ? " box" : "";
    document.getElementById(id).setAttribute("class", "event-span active" + boxClass);
}
function objEvent(ndex, params) {
    var id = params.time;
    document.getElementById(id).setAttribute("class", "event-span other");
}

// create events
var numvents = Math.floor(Math.random()*5) + 10;

function createSpan(eventTime){
    var spanel = document.createElement("span");
    spanel.setAttribute("id", eventTime);
    spanel.className = "event-span";
    spanel.appendChild(document.createTextNode(eventTime));
    document.getElementById("events").appendChild(spanel);
}

function createEvent(eventTime) {
    var coinFlip = VS.getItem([0, 1]),
        isBox = VS.getItem([0, 1, 1]);
    if(coinFlip){
        VS.score.add([eventTime, userEvent, [eventTime, isBox]]); // scoreEvent -- [time, function, params]
    } else {
        VS.score.add([eventTime, objEvent, {time: eventTime, box: isBox}]); // scoreEvent -- [time, function, params]
    }
    createSpan(eventTime);
}
createEvent(0); // create first event
for (var i = 0; i < numvents; i++) { // create remaining events
    var eventTime = Math.floor(Math.random()*500)+(i*1500)+1000;
    createEvent(eventTime);
}

VS.score.playCallback = function() {
    // VS.page.headerClassed("hide");
    // VS.page.footerClassed("hide");
};

VS.score.stopCallback = function() {
    var spanz = document.getElementsByClassName("event-span");
    for (var i = 0; i < spanz.length; i++) {
        var thisspan = spanz[i];
        thisspan.className = "event-span";
    }
    // VS.page.headerClassed("show");
    // VS.page.footerClassed("show");
};
