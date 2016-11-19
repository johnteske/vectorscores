d3.select("svg").remove();
var group = d3.select("main").append("div");

// should these be paired? either as array or object?
var list = [">", ".", "_", "'", "^"];
var weight = [1, 1, 1, 1, 1]; // initial weights

var choiceTop = group.append("p").classed("button", "true").on("click", function() { choiceMake(d3.select(this).data()) }); // potential to be modular?
var choiceBot = group.append("p").classed("button", "true").on("click", function() { choiceMake(choiceBot.data()) }); // hard-coded

// add bar chart visualization
d3.select("main").append("p").classed("chart-info", true).text("Relative probability of symbol appearing:");
d3.select("main").append("div").classed("chart-wrap", true);
d3.select(".chart-wrap").append("div").classed("chart", true);

d3.select(".chart").selectAll("div")
    .data(weight)
    .enter()
    .append("div")
    .text(function(d, i) { return list[i]; })
    .style("display", "inline-block");

function updateReadout() {
    var y = d3.scale.linear()
        .domain([0, d3.max(weight)])
        .range([0, 40]);

    d3.select(".chart").selectAll("div")
        .data(weight)
        // .text(function(d) { return d; })
        .style("height", function(d) { return y(d) + "px"; })
}

function updateButtons() {
    // generate another two options
    var newTop = getWeightedItem(list, weight);
    choiceTop.data(newTop).text(newTop);

    var newBot = getWeightedItem(list, weight);
    choiceBot.data(newBot).text(newBot);

    updateReadout();
}

function choiceMake(choice) {
    // record choice and add to weight array
    var choiceIndex = list.indexOf(choice[0]); // index 0 as data is array
    // console.log(choice[0], choiceIndex);
    weight[choiceIndex] += 1; // may lower the increment depending on how many choices are made--currently the direction is very easily influenced

    updateButtons();
}

// set initial values
updateButtons();
