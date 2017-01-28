debug = VS.getQueryString("debug") == 1 ? true : false;

if(debug) {
    main.append("line")
    .classed("debug-center", true)
    .style("stroke", "red");
}

function resizeDebug(viewWidth, viewCenter) {
    d3.select("line.debug-center")
    .attr("x1", viewCenter)
    .attr("y1", 0)
    .attr("x2", viewCenter)
    .attr("y2", 2000);
}
