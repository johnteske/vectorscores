d3.select("svg").remove();
var group = d3.select("main").append("div");

// should these be paired? either as array or object?
var list = ["A", "B", "C", "D", "E"];
var weight = [1, 1, 1, 1, 1]; // initial weights

var choiceTop = group.append("p").classed("button", "true").on("click", function() { choiceMake(d3.select(this).data()) }); // potential to be modular?
var choiceBot = group.append("p").classed("button", "true").on("click", function() { choiceMake(choiceBot.data()) }); // hard-coded

var readout = group.append("p");

function updateButtons() {
    // generate another two options
    var newTop = getWeightedItem(list, weight);
    choiceTop.data(newTop).text(newTop);

    var newBot = getWeightedItem(list, weight);
    choiceBot.data(newBot).text(newBot);

    var text2disp = list.reduce(function(arr, v, i) {
        return arr.concat(v, weight[i]);
    }, []);
    // console.log(text2disp);
    readout.text(text2disp.join(", "));
}

function choiceMake(choice) {
    // record choice and add to weight array
    var choiceIndex = list.indexOf(choice[0]); // index 0 as data is array
    console.log(choice[0], choiceIndex);
    weight[choiceIndex] += 1; // may lower the increment depending on how many choices are made--currently the direction is very easily influenced

    updateButtons();
}

// set initial values
updateButtons();
