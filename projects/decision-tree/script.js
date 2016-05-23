d3.select("svg").remove();
var group = d3.select("main").append("div");

// should these be paired? either as array or object?
var list = ["A", "B", "C"];
var weight = [1, 1, 1]; // initial weights


//
// var p = group.selectAll("p")
//     .data([0,1]) // make two, with dummy starting values
//     .enter()
//     .append("p")
//     .text("test");

var choiceTop = group.append("p").classed("button", "true").text("_").on("click", function() { choiceMake(d3.select(this).data()) }); // potential to be modular?
var choiceBot = group.append("p").classed("button", "true").text("_").on("click", function() { choiceMake(choiceBot.data()) }); // hard-coded

var readout = group.append("p").text("_");

// choiceTop.data([0]);
// choiceBot.data([0]);

function updateButtons() {
    // generate another two options
    var newTop = getRandomItem(list, weight);
    choiceTop.data(newTop).text(newTop);

    var newBot = getRandomItem(list, weight);
    choiceBot.data(newBot).text(newBot);

    readout.text(
        String(list.join(", ")) + ": " +
        String(weight.join(", "))
    );
}

function choiceMake(choice) {
    // capture choice
    // TODO
    var choiceIndex = list.indexOf(choice[0]); // index 0 as data is array
    console.log(choice[0], choiceIndex);
    weight[choiceIndex] += 1;

    // choiceTop.data([0]); console.log( choiceTop.data() );
    // console.log( choiceBot.data() );
    updateButtons();
}

////

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomItem(list, weight) {
    var total_weight = weight.reduce( function(prev,cur,i,arr) { return prev + cur; } );

    var random_num = rand(0, total_weight);
    var weight_sum = 0;

    for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i];
        if (random_num <= weight_sum) { return list[i]; }
    }
}

// set initial values
updateButtons();
