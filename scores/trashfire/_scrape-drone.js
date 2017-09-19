TrashFire.scrapeDrone = (function() {
    var drone = {
        width: TrashFire.view.width * 0.75 // 232 // dumpster bottom edge
    };

    var pathGenerator = d3.line()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    drone.group = TrashFire.wrapper.append("g")
        .attr("class", "drone")
        .attr("transform", "translate(" + ((TrashFire.view.width * 0.5) - (drone.width * 0.5)) + "," + 350 + ")");

    function makePath() {
        var nPoints = 232,
            length = drone.width,
            slice = length / (nPoints + 1),
            height = 3;

        var points = [];

        for (var j = 0; j < nPoints; j++) {
            points.push([
                j * slice,
                (height * 0.5) + (Math.random() * height)
            ]);
        }

        return points;
    }

    drone.pathData = makePath();

    drone.selection = drone.group.append("path")
        .style("opacity", 0)
        .attr("fill", "none")
        .attr("stroke", "#444")
        .attr("d", function() {
            return lineGenerator(drone.pathData);
        });

    drone.show = function(t) {
        var dur = typeof t === "undefined" ? 7000 : t;
        drone.selection
            .attr("stroke-width", 0)
            .transition().duration(dur)
            .attr("stroke-width", 5)
            .style("opacity", 1);
    };

    drone.hide = function(t) {
        var dur = typeof t === "undefined" ? 7000 : t;
        drone.selection
            .transition().duration(dur)
            .attr("stroke-width", 0)
            .style("opacity", 0);
    };

    return drone;
})();
