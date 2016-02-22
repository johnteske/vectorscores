var globWidth = 120,
    radius = globWidth * 0.5,
    padding = 7;
    width = globWidth + (padding * 2);
    height = globWidth + (padding * 2),
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
        var x = radius + padding;
            y = padding;
        return "translate(" + x + ", " + y + ")";
    });

for (var i = 0; i < cloudSize; i++) {
    glob.append("ellipse")
        .attr("cx", globWidth * 0.5)
        .attr("cy", globWidth * 0.25)
        .attr("rx", 5)
        .attr("ry", 7)
        .attr("transform", function() {
            var point = newPoint();
            return "translate(" + point.x + ", " + point.y + ") rotate(60)"
        });
    }

function moveIt(){
    // d3.selectAll("ellipse:nth-child("+ Math.floor(Math.random() * cloudSize ) + ")")
    d3.selectAll("ellipse")
        .transition()
        .duration(dur)
        .attr("transform", function() {
            var point = newPoint();
            return "translate(" + point.x + ", " + point.y + ") rotate(60)"
        });
    }

moveIt();

setInterval(function(){moveIt()}, dur);
