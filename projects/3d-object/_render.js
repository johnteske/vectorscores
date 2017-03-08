function render() {

    // remove existing elements, if any
    score.container.selectAll(".rendered").remove();

    var _points = [];

    for (var row = 0; row < score.height; row++) {
        for (var col = 0; col < score.width; col++) {
            var value = score.obj[row][col],
                testScale = 8, // use this for simple TEST
                p = performer.getPosition(),
                x = col,
                y = row,
                a = x - p.x,
                b = y - p.y,
                z = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
                // TODO try "Oblique projection"
                // (x,y) = (x + zcos0,y + zsin0)

            _points.push({
                x: x,
                y: y,
                z: z,
                value: value
            });
        }
    }

    _points.sort(function (a, b) {
      return a.z - b.z;
    });

    for (var i = 0; i < _points.length; i++) {
        var point = _points[i];
        score.container.append("circle")
            .classed("rendered", 1)
            .attr("r", point.z)
            .style("stroke", "none")
            .style("fill", function() { return point.value ? "black" : "grey"; })
            .attr("cx", point.x * testScale)
            // TODO need to factor in y coordinate as well
            // y display would be more for height, layer
            // .attr("cy", point.y * testScale); // for TEST, and a tiny amount of depth
    }

    score.container.attr("transform", "translate (120, 50)"); // TEST

}
