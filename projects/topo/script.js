var main = d3.select(".main"),
    topo = main.append("g");

var width = 480,
    // height = 480,
    rows = 8,
    cols = 8,
    tileWidthHalf = 16,
    tileHeightHalf = 8;

var dict = {
    0: ".",
    1: ">",
    2: "-"
};

main.style("width", width + "px")
    .style("height", width + "px");

function createDataset(rows,cols){
    var _array = [];
    for(var i = 0; i < rows; i++){ // row
        _array[i] = [];
        for(var j = 0; j < cols; j++){ // col
            _array[i][j] = VS.getWeightedItem([0,1,2],[0.55,0.05,0.4]);
        }
    }
    return _array;
}
var dataset = createDataset(rows,cols);


var documentFragment = document.createDocumentFragment(),
    df = d3.select(documentFragment);

for(var i = 0; i < rows; i++){ // row
    for(var j = 0; j < cols; j++){ // col
        df.append("svg:text")
        .text(function() {
            return dict[dataset[i][j]];
        })
        .attr("transform", function() {
            return "translate(" +
                ((j - i) * tileWidthHalf) + ", " +
                ((j + i) * tileHeightHalf) + ")";
        });
    }
}

topo.node().appendChild(documentFragment);


topo.attr("transform", "translate(240,120)");
