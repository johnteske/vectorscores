function flatten(array) {
    return array.reduce(function(a, b) { return a.concat(b); }, []);
};

function render() {
    // remove existing elements, if any
    score.container.selectAll(".rendered").remove();

    for (var i = 0; i < score.obj.length; i++) {
        function px(point) { return point[0]; }
        function py(point) { return point[1]; }
        function pz(point) { return point[2]; }

        var a = score.obj[i]; // the 3D point to be projected
        var c = [0, 0, 5]; // 3D point representing the camera
        var theta = [Math.PI, 0, 0]; // orientation of the camera (Tait–Bryan angles)
        var e = [0, 0, 50]; // viewer's position relative to display surface which goes through point c

        var xMatrix = (function() {
            var Ox = theta[0], // px(theta)
                cosOx = Math.cos(Ox),
                sinOx = Math.sin(Ox);
            return [
                [1, 0, 0],
                [0, cosOx, sinOx],
                [0, -sinOx, cosOx]
            ];
        })();
        var yMatrix = (function() {
            var Oy = theta[1], // py(theta)
                cosOy = Math.cos(Oy),
                sinOy = Math.sin(Oy);
            return [
                [cosOy, 0, -sinOy],
                [0, 1, 0],
                [sinOy, 0, cosOy]
            ];
        })();
        var zMatrix = (function() {
            var Oz = theta[2], // pz(theta)
                cosOz = Math.cos(Oz),
                sinOz = Math.sin(Oz);
            return [
                [cosOz, sinOz, 0],
                [-sinOz, cosOz, 0],
                [0, 0, 1]
            ];
        })();
        var aMinusCMatrix = [
            [a[0] - c[0]],
            [a[1] - c[1]],
            [a[2] - c[2]]
        ];

        var d = multiplyMatrices(multiplyMatrices(multiplyMatrices(xMatrix, yMatrix), zMatrix), aMinusCMatrix);
        d = flatten(d);

        var b = {
            x: ((pz(e) / pz(d)) * px(d)) - px(e),
            y: ((pz(e) / pz(d)) * py(d)) - py(e)
        };
        console.log(b);

        score.container.append("circle")
            .classed("rendered", 1)
            .attr("r", 1)
            .style("stroke", "none")
            .style("fill", "black")
            .attr("cx", b.x)
            .attr("cy", b.y);
    }

    score.container.attr("transform", "translate (150, 90)"); // TODO for testing

}
