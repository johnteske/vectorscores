function flatten(array) {
    return array.reduce(function(a, b) { return a.concat(b); }, []);
}

function makePoint(array) {
    return {
         x: array[0],
         y: array[1],
         z: array[2]
     };
}

function render() {
    // remove existing elements, if any
    score.container.selectAll('.rendered').remove();

    var c = makePoint([0, 0, 5]); // 3D point representing the camera
    var theta = makePoint([0, 0, 0]); // orientation of the camera (Tait–Bryan angles)

    // var c = makePoint([0, 0, -5]); // 3D point representing the camera
    // var theta = makePoint([Math.PI, 0, Math.PI]); // orientation of the camera (Tait–Bryan angles) NOTE x, y, z?

    var xMatrix = (function() {
        var cosOx = Math.cos(theta.x),
            sinOx = Math.sin(theta.x);
        return [
            [1, 0, 0],
            [0, cosOx, sinOx],
            [0, -sinOx, cosOx]
        ];
    })();
    var yMatrix = (function() {
        var cosOy = Math.cos(theta.y),
            sinOy = Math.sin(theta.y);
        return [
            [cosOy, 0, -sinOy],
            [0, 1, 0],
            [sinOy, 0, cosOy]
        ];
    })();
    var zMatrix = (function() {
        var cosOz = Math.cos(theta.z),
            sinOz = Math.sin(theta.z);
        return [
            [cosOz, sinOz, 0],
            [-sinOz, cosOz, 0],
            [0, 0, 1]
        ];
    })();

    var cameraRotationMatrix = multiplyMatrices(multiplyMatrices(xMatrix, yMatrix), zMatrix);

    var rz = 100; // distance from the recording surface to the camera center

    for (var i = 0; i < score.obj.length; i++) {

        var a = makePoint(score.obj[i]); // the 3D point to be projected

        var aMinusCMatrix = [
            [a.x - c.x],
            [a.y - c.y],
            [a.z - c.z]
        ];

        var d = multiplyMatrices(cameraRotationMatrix, aMinusCMatrix);
        d = makePoint(flatten(d));

        var b = {
            x: (d.x / d.z) * rz,
            y: (d.y / d.z) * rz
        };

        score.container.append('circle')
            .classed('rendered', 1)
            .attr('r', 1)
            .style('stroke', 'none')
            .style('fill', 'black')
            .attr('cx', b.x)
            .attr('cy', b.y);
    }

    score.container.attr('transform', 'translate (150, 90)'); // TODO for testing
}
