---
layout: compress-js
---
VS.lineCloud = function() {
    var w = VS.constant(127),
        h = VS.constant(127),
        c = d3.curveLinear;

    function pitchDurationToXY(points) {
        var totalDuration = points.reduce(function(a, o) {
            return a + o.duration;
        }, 0);

        var currentTime = 0;

        var yOffset = Math.floor(VS.getRandExcl(0, 128));

        return points.map(function(o) {
            var point = {
                x: currentTime,
                y: o.pitch + yOffset
            };

            currentTime += o.duration / totalDuration;

            return point;
        });
    }

    function midiToY(y) {
        return 1 - (y / 127);
    }

    function lineCloud(selection, args) {
        args = args || {};

        var n = args.n || 1;

        var width = w(), // w(d, i),
            height = h(); // h(d, i);

        // pitch === relative
        var testLine = [
            {
                pitch: 0,
                duration: 1
            },
            {
                pitch: 3,
                duration: 2
            },
            {
                pitch: -2,
                duration: 1
            },
            // TODO how to handle last duration?
            // if last dur !== 0, duplicate pitch with 0 dur
            {
                pitch: -2,
                duration: 0
            }
        ];

        var data = [];
        var points;

        for (var i = 0; i < (n + 1); i++) {
            points = pitchDurationToXY(testLine);
            data.push(points);
        }

        var line = d3.line()
            .x(function(d) {
                return d.x * width;
            })
            .y(function(d) {
                return midiToY(d.y) * height;
            })
            .curve(c);

        selection.selectAll(".line-cloud-path")
            .data(data)
            .enter()
            .append("path")
                .attr("class", "line-cloud-path")
                .attr("d", line);
    }

    lineCloud.width = function(_) {
        return arguments.length ? (w = typeof _ === "function" ? _ : VS.constant(+_), lineCloud) : w;
    };

    lineCloud.height = function(_) {
        return arguments.length ? (h = typeof _ === "function" ? _ : VS.constant(+_), lineCloud) : h;
    };

    lineCloud.curve = function(_) {
        return arguments.length ? (c = typeof _ === "function" ? _ : c, lineCloud) : c;
    };

    return lineCloud;
};
