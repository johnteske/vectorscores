var globWidth = 240,
    radius = 3000; //globWidth * 0.25,
    padding = 10;
    width = globWidth + (padding * 2),
    height = globWidth + (padding * 2),
    center = width * 0.5,
    dur = 3000;

var noteheads = [
    // "M397 -1597q0 12 6 30q49 131 49 305t-56 302t-179 285t-217 173v490q0 31 20 30q53 0 62 -45q43 -254 223 -534q236 -375 236 -703q0 -143 -41 -301l-13 -53q-6 -25 -26 -35t-31 -4q-33 23 -33 60z", // eighth flag
    "M223 -289q-96 0 -160 52q-63 52 -63 141q0 152 134 268t321 117q100 0 162 -53t63 -140q0 -143 -150 -264t-307 -121z", // quarter
    // "M625 96q0 28 -15 54q-30 49 -98 49t-227 -93q-215 -123 -215 -210q0 -23 14 -48q31 -53 107 -53t219 96q215 141 215 205zM234 -297q-106 0 -170 52t-64 153t98 235q50 66 146 110t210 44t180 -54q64 -54 64 -139t-43 -161t-91 -124t-136 -82t-194 -34z" // half
];

function chooseNotehead() {
    return noteheads[Math.floor(Math.random()*noteheads.length)];
}

var main = d3.select(".main")
    .style('width', width + 'px')
    .style('height', width + 'px');

function newPoint() {
    var angle = Math.random()*Math.PI*2;
    var dist = Math.random() - Math.random();
    return {
        x: Math.cos(angle) * radius * dist,
        y: Math.sin(angle) * radius * dist
    }
}

var cloudSize = Math.ceil(Math.random() * 10) + 20;
var glob = main
    .append("g")
    .attr("transform", function(d, i) {
        var x = center,
            y = center - padding;//padding;
        return "translate(" + x + ", " + y + ")";
    });

for (var i = 0; i < cloudSize; i++) {
    glob.append("path")
        .attr("d", chooseNotehead())
        .attr("transform", function() {
            var point = newPoint();
            return "scale(0.025,-0.025) translate(" + point.x + ", " + point.y + ")"
        });
    }

main.append("text")
    .attr("fill", "#111")
    .attr("text-anchor", "middle")
    .attr("x", center)
    .attr("y", globWidth);

function moveIt(){
    // radius = globWidth * Math.random() * 0.4;
    d3.selectAll("text").text("[0, " + Math.floor(Math.random() * 2 + 1) + ", " + Math.floor(Math.random() * 2 + 3) + "]");
    d3.selectAll("path")
        .transition()
        .duration(50)
        .attr("d", function() {return chooseNotehead()})
        .transition()
        .duration(dur)
        .attr("transform", function() {
            var point = newPoint();
            return "scale(0.025,-0.025) translate(" + point.x + ", " + point.y + ")"
        });
    }

moveIt();

setInterval(function(){moveIt()}, dur);

// DEBUG

main.classed("debug", true);
main.append("circle")
    .attr("stroke", "red")
    .attr("fill", "white")
    .attr("r", 5)
    .attr("transform", function(d, i) {
        var x = center
            y = center
        return "translate(" + x + ", " + y + ")";
    });
