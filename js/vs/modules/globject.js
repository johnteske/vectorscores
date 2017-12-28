---
layout: compress-js
---
VS.globject = function() {
    var w = VS.constant(127),
        h = VS.constant(127),
        c = d3.curveCardinalClosed.tension(0.5);

    function yMIDI(d) {
        return (1 - (d.y / 127));
    }

    function yNormalized(d) {
        return 1 - d.y;
    }

    function globject(d, i) {
        var selection = d3.select(this),
            width = w(d, i),
            height = h(d, i);

        var rangeEnv = d.rangeEnvelope,
            rangePoints = [],
            rangeType = rangeEnv.type.toLowerCase(),
            scaleY;

        // old model, range points matching every time point
        if (rangeEnv.times) {
            for (var t = 0; t < rangeEnv.times.length; t++) {
                rangePoints.push({ 'x': rangeEnv.times[t], 'y': rangeEnv.hi[t] });
                rangePoints.unshift({ 'x': rangeEnv.times[t], 'y': rangeEnv.lo[t] });
            }
        // new model, range points paired with time
        } else {
            rangePoints = rangeEnv.lo.map(function(o) {
                return {
                    'x': o.time,
                    'y': o.value
                };
            }).reverse();

            rangePoints = rangePoints.concat(rangeEnv.hi.map(function(o) {
                return {
                    'x': o.time,
                    'y': o.value
                };
            }));
        }

        if (rangeType === 'midi') {
            scaleY = yMIDI;
        } else if (rangeType === 'normalized') {
            scaleY = yNormalized;
        }

        var line = d3.line()
             .x(function(d) {
                 return d.x * width;
             })
             .y(function(d) {
                 return scaleY(d) * height;
             })
             .curve(c);

        selection.classed('globject', true);

        selection.append('clipPath')
            .attr('id', 'globject-clip-' + i)
            .append('path')
                .attr('d', line(rangePoints));

        selection.append('g')
            .attr('class', 'globject-content')
            .attr('clip-path', 'url(#globject-clip-' + i + ')');

        selection.append('path')
             .attr('class', 'globject-path')
             .attr('d', line(rangePoints));
    }

    globject.width = function(_) {
        return arguments.length ? (w = typeof _ === 'function' ? _ : VS.constant(+_), globject) : w;
    };

    globject.height = function(_) {
        return arguments.length ? (h = typeof _ === 'function' ? _ : VS.constant(+_), globject) : h;
    };

    globject.curve = function(_) {
        return arguments.length ? (c = typeof _ === 'function' ? _ : c, globject) : c;
    };

    return globject;
};
