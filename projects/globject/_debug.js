debug = VS.getQueryString("debug") == 1 ? true : false;

if(debug){
    main.classed("debug", true);
    main.append("rect")
        .attr("width", width)
        .attr("height", width)
        .attr("transform", "translate(" + margin + ", " + margin + ")");
    main.append("circle")
        .attr("r", 5)
        .attr("transform", "translate(" + center + ", " + center + ")");
}

function resizeDebug(width, center) {
    d3.select("rect")
        .attr("width", width)
        .attr("height", width);
    d3.select("circle")
        .attr("transform", "translate(" + center + ", " + center + ")");
}
