// initial values
var globWidth = 240,
    radius = globWidth * 5, // should be relative to width somehow
    margin = 20,
    innerwidth = 240, // placeholder name
    maxwidth = 480,
    width = innerwidth + (margin * 2),
    center = width * 0.5,
    scale = (width / 9600),
    dur = 3000;
var textoffset = 5;
var noteheads = [
    // "M397 -1597q0 12 6 30q49 131 49 305t-56 302t-179 285t-217 173v490q0 31 20 30q53 0 62 -45q43 -254 223 -534q236 -375 236 -703q0 -143 -41 -301l-13 -53q-6 -25 -26 -35t-31 -4q-33 23 -33 60z", // eighth flag
    "M223 -289q-96 0 -160 52q-63 52 -63 141q0 152 134 268t321 117q100 0 162 -53t63 -140q0 -143 -150 -264t-307 -121z", // quarter
    // "M625 96q0 28 -15 54q-30 49 -98 49t-227 -93q-215 -123 -215 -210q0 -23 14 -48q31 -53 107 -53t219 96q215 141 215 205zM234 -297q-106 0 -170 52t-64 153t98 235q50 66 146 110t210 44t180 -54q64 -54 64 -139t-43 -161t-91 -124t-136 -82t-194 -34z" // half
];
var debug = VS.getQueryString("debug") == 1 ? true : false;

// function chooseNotehead() {
//     return noteheads[Math.floor(Math.random()*noteheads.length)];
// }

var main = d3.select(".main")
    .style("width", width + "px")
    .style("height", width + "px");

function newPoint() {
    var angle = Math.random() * Math.PI * 2,
        dist = Math.random() - Math.random();
    return {
        x: Math.cos(angle) * radius * dist,
        y: Math.sin(angle) * radius * dist
    };
}

var cloudSize = Math.ceil(Math.random() * 10) + 20;
var glob = main
    .append("g")
    .attr("transform", "translate(" + center + ", " + center + ")");

function transformHead() {
    var point = newPoint();
    return "scale("+scale+", "+(-1 * scale)+") translate(" + point.x + ", " + point.y + ")";
}

for (var i = 0; i < cloudSize; i++) {
    glob.append("path")
        .attr("d", noteheads[0]) //chooseNotehead())
        .attr("transform", function(){ return transformHead(); });
}

main.append("text")
    .attr("fill", "#111")
    .attr("text-anchor", "middle")
    .attr("x", center)
    .attr("y", innerwidth - textoffset);

function moveIt(){
    // radius = globWidth * Math.random() * 5;
    d3.selectAll("text").text("[0, " + Math.floor(Math.random() * 2 + 1) + ", " + Math.floor(Math.random() * 2 + 3) + "]");
    d3.selectAll("path")
        // .transition()
        // .duration(50)
        // .attr("d", function() {return chooseNotehead()})
        .transition()
        .duration(dur)
        .attr("transform", function(){ return transformHead(); });
}

for(var i = 0; i < 10; i++) {
    VS.score.add([i * dur, moveIt]);
}

// resize

d3.select(window).on("resize", resize);

function resize() {
    // update width
    width = Math.min( parseInt(d3.select("main").style("width"), 10), maxwidth);
    center = width * 0.5;
    innerwidth = width - (margin * 2);

    main
        .style("width", width + "px")
        .style("height", width + "px");
    glob.attr("transform",
        "translate(" + center + ", " + center + ")" +
        "scale("+(width/globWidth)+","+(width/globWidth)+")"
        );
    d3.select("text")
        .attr("x", center)
        .attr("y", width - textoffset);

    if(debug){
        d3.select("rect")
            .attr("width", innerwidth)
            .attr("height", innerwidth);
        d3.select("circle")
            .attr("transform", "translate(" + center + ", " + center + ")");
    }
}

resize();

if(debug) {
    main.classed("debug", true);
    main.append("rect")
        .attr("width", width - (margin*2))
        .attr("height", width - (margin*2))
        .attr("transform", "translate(" + margin + ", " + margin + ")");
    main.append("circle")
        .attr("r", 5)
        .attr("transform", "translate(" + center + ", " + center + ")");
}
