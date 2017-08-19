---
layout: compress-js
---
VS.globject = function() {
    var w = VS.constant(127),
        h = VS.constant(127);

    function yMIDI(d) {
        return (1 - (d.y / 127));
    }

    function yNormalized(d) {
        return 1 - d.y;
    }

    function globject(d, i) {
        var selection = d3.select(this),
            width = w(d, i),
            height = h(d, i),
            margin = {
                left: 5
            };

        var rangeEnv = d.rangeEnvelope,
            rangePoints = [],
            rangeType = rangeEnv.type.toLowerCase(),
            scaleY;

        for (var t = 0; t < rangeEnv.times.length; t++) {
            rangePoints.push({ "x": rangeEnv.times[t], "y": rangeEnv.hi[t] });
            rangePoints.unshift({ "x": rangeEnv.times[t], "y": rangeEnv.lo[t] });
        }

        if (rangeType === "midi") {
            scaleY = yMIDI;
        } else if (rangeType === "normalized") {
            scaleY = yNormalized;
        }

        var line = d3.line()
             .x(function(d) {
                 return d.x * width;
             })
             .y(function(d) {
                 return scaleY(d) * height;
             })
             .curve(d3.curveCardinalClosed.tension(0.8));

        selection.classed("globject", true);

        selection.append("clipPath")
            .attr("id", "globject-clip-" + i)
            .append("path")
                .attr("transform", "translate(" + margin.left + "," + 0 + ")")
                .attr("d", line(rangePoints));

        selection.append("g")
            .attr("class", "globject-content")
            .attr("clip-path", "url(#globject-clip-" + i + ")");

        selection.append("path")
             .attr("transform", "translate(" + margin.left + "," + 0 + ")")
             .attr("class", "globject-path")
             .attr("d", line(rangePoints));
    }

    globject.width = function(_) {
        return arguments.length ? (w = typeof _ === "function" ? _ : VS.constant(+_), globject) : w;
    };

    globject.height = function(_) {
        return arguments.length ? (h = typeof _ === "function" ? _ : VS.constant(+_), globject) : h;
    };

    return globject;
};
