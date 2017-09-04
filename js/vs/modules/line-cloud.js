---
layout: compress-js
---
VS.lineCloud = function() {
    var w = VS.constant(127),
        h = VS.constant(127),
        l = VS.constant([{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }]), // TODO pitch === relative
        c = d3.curveLinear;

    // TODO how to handle last duration?
    // if last dur !== 0, duplicate pitch with 0 dur

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

        var data = [];

        for (var i = 0; i < (n + 1); i++) {
            data.push(pitchDurationToXY(l()));
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

    // not line, as replacing d3.line may an option in the future
    lineCloud.l = function(_) {
        return arguments.length ? (l = typeof _ === "function" ? _ : VS.constant(_), lineCloud) : l;
    };

    lineCloud.curve = function(_) {
        return arguments.length ? (c = typeof _ === "function" ? _ : c, lineCloud) : c;
    };

    return lineCloud;
};
