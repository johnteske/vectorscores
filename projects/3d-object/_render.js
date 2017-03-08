function render() {

    // remove existing elements, if any
    score.container.selectAll(".rendered").remove();

    var _points = [];
    var _performer = performer.get();

    for (var row = 0; row < score.height; row++) {
        for (var col = 0; col < score.width; col++) {
            var value = score.obj[row][col],
                testScale = 16, // use this for simple TEST
                a = col - _performer.x,
                b = row - _performer.y,
                z = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) ),
                // "Oblique projection"
                // (x,y) = (x + zcos0,y + zsin0)
                // TODO x is backwards on one side
                // TODO y does not factor in -- perhaps here y is actually the z value
                x = col + (z * Math.cos(_performer.angle)),
                y = row + (z * Math.sin(_performer.angle));

            _points.push({
                x: x,
                y: y,
                z: z,
                value: value
            });
        }
    }

    _points.sort(function (a, b) {
        return b.z - a.z;
    });

    for (var i = 0; i < _points.length; i++) {
        var point = _points[i];
        score.container.append("circle")
            .classed("rendered", 1)
            .attr("r", 32 / point.z)
            .style("stroke", "none")
            .style("fill", function() { return point.value ? "black" : "grey"; })
            .attr("cx", point.x * testScale)
            // TODO need to factor in y coordinate as well
            // y display would be more for height, layer
            // .attr("cy", point.y * testScale); // for TEST, and a tiny amount of depth
    }

    score.container.attr("transform", "translate (120, 60)"); // TEST

}
