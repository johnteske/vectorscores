debug = VS.getQueryString("debug") == 1 ||  false;

if(debug) {
    main.append("line")
        .classed("debug-center-v", true);
    // main.append("line")
    //     .classed("debug-center-h", true);
}

function resizeDebug() {
    d3.select("line.debug-center-v")
        .attr("x1", view.center)
        .attr("y1", 0)
        .attr("x2", view.center)
        .attr("y2", 2000);
    // d3.select("line.debug-center-h")
    //     .attr("x1", 0)
    //     .attr("y1", viewHeight / 2)
    //     .attr("x2", 900)
    //     .attr("y2", viewHeight / 2);
}
