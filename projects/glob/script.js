var globWidth = 240,
    radius = 5; //globWidth * 0.25,
    padding = 10;
    width = globWidth + (padding * 2),
    height = globWidth + (padding * 2),
    center = width * 0.5,
    dur = 3000;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

// main.classed("debug", true);

function newPoint() {
    var angle = Math.random()*Math.PI*2;
    var dist = Math.random() - Math.random();
    return {
        x: Math.cos(angle) * radius * dist,
        y: Math.sin(angle) * radius * dist
    }
}

var cloudSize = Math.ceil(Math.random() * 10) + 40;
var glob = main
    .append("g")
    .attr("transform", function(d, i) {
        var x = center,
            y = padding;
        return "translate(" + x + ", " + y + ")";
    });

for (var i = 0; i < cloudSize; i++) {
    glob.append("ellipse")
        .attr("cx", center - 25) // offset to compensate for rotation
        .attr("cy", center * 0.5 - 5)
        .attr("rx", 5)
        .attr("ry", 7)
        .attr("transform", function() {
            var point = newPoint();
            return "rotate(60) translate(" + point.x + ", " + point.y + ")"
        });
    }

// main.append("circle")
//     .attr("stroke", "red")
//     .attr("fill", "white")
//     .attr("r", 5)
//     .attr("transform", function(d, i) {
//         var x = center
//             y = center
//         return "translate(" + x + ", " + y + ")";
//     });

main.append("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("x", center)
    .attr("y", globWidth)
    .text("[0,2,6]");

function moveIt(){
    radius = globWidth * Math.random() * 0.5;
    // d3.selectAll("ellipse:nth-child("+ Math.floor(Math.random() * cloudSize ) + ")")
    d3.selectAll("ellipse")
        .transition()
        .duration(dur)
        .attr("transform", function() {
            var point = newPoint();
            return "rotate(60) translate(" + point.x + ", " + point.y + ")"
        });
    }

moveIt();

setInterval(function(){moveIt()}, dur);
