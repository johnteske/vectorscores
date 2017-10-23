(function() {
    // add cue
    var infoCue = d3.select(".info-cue")
        .attr("width", 14)
        .attr("height", 12)
        .append("g")
            .attr("transform", "translate(7, 0)");

    VS.cueTriangle(infoCue);

    // add ghost
    var infoGhost = d3.select(".info-ghost")
        .attr("width", 58)
        .attr("height", 52);

    makeGhost.call(infoGhost.node());

    infoGhost.select("g")
        .attr("transform", "translate(3, 13)");
})();
