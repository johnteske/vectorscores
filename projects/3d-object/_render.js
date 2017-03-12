function render() {

    // remove existing elements, if any
    score.container.selectAll(".rendered").remove();

    var _points = [];
    var _performer = performer.get();

    for (var row = 0; row < score.height; row++) {
        for (var col = 0; col < score.width; col++) {
            var value = score.obj[row][col],
                testScale = 42, // use this for simple TEST
                a = col - _performer.x,
                b = row - _performer.y,
                z = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) ),
                // "Oblique projection"
                // (x,y) = (x + zcos0,y + zsin0)
                // TODO y does not factor in -- perhaps here y is actually the z value
                cos = Math.cos(_performer.angle),
                sin = Math.sin(_performer.angle),
                x = col + (z * cos),
                y = row + (z * sin);

                x = _performer.y >= 0 ? x - _performer.x : _performer.x - x;
                // y = _performer.y = 0 ? y - _performer.y : _performer.y - y;

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

    // var z1 = _points[0].z;
    var closest_z = _points[_points.length - 1].z;

    for (var i = 0; i < _points.length; i++) {
        var point = _points[i];
        console.log(closest_z, point.z, closest_z / point.z);
        score.container.append("circle")
            .classed("rendered", 1)
            .attr("r", 6 * (closest_z / point.z)) // prevent divide by 0
            .style("stroke", "none")
            .style("fill", function() { return colors[point.value]; })
            // .style("opacity", (closest_z / point.z))
            .attr("cx", point.x * testScale)
            // TODO need to factor in y coordinate as well
            // y display would be more for height, layer
            .attr("cy", -point.z * 6); // yes, dots should be in perspective, not flat
    }

    score.container.attr("transform", "translate (150, 90)"); // TEST

}
