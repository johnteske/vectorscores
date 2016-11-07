var main = d3.select(".main"),
    topo = main.append("g");

var width = 480,
    height = 480,
    rows = 8,
    cols = 12,
    cellSize = 25,
    cellSpacing = cellSize,
    rowOffset = cellSize * -0.5;

var dict = {
    0: ".",
    1: ">",
    2: "-"
}

main.style('width', width + 'px')
    .style('height', width + 'px');

// main.classed('debug', 1);

function createDataset(rows,cols){
    var _array = [];
    for(var i = 0; i < rows; i++){ // row
        _array[i] = [];
        for(var j = 0; j < cols; j++){ // col
            _array[i][j] = getItem([0,1,2]);
        }
    }
    return _array;
}

var dataset = createDataset(rows,cols);


topo.selectAll("g")
    .data(dataset)
    // rows
    .enter().append("g")
    .attr("transform", function (d, i) {
        return "translate(" + (i * rowOffset) + ", " + (i * cellSize) + ")"
    })
    // each column in row
    .selectAll("text")
    .data(function(d) {return d;})
    .enter().append("text")
    .text(function(d, i) {
        return dict[d];
    })
    .attr("x", function(d, i) {
        return i * cellSpacing;
    });

topo
    .attr("transform",
        "translate(120,120)"
    );
//     .transition()
//     .delay(500)
//     .duration(500)
//     .attrTween("transform", tween);
//     // .attr("transform",
//         // "translate(120,120) rotate(-45)"
//     // );
//
// function tween(d, i, a) {
//   return d3.interpolateString("translate(120,120) rotate(0,60,60)", "translate(120,150) rotate(-45,60,60)");
// }
