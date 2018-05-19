var pitchedPart = (function() {
    var part = {};

    var bars;

    // TODO don't mix score generation (this) and score rendering (intention of this file)
    function coerceData() {
        function getRandAndRemove(array) {
            var i = Math.floor(VS.getRandExcl(0, array.length));
            return array.splice(i, 1);
        }

        var contours = {
            descending: globjects.filter(function(g) {
                return g.contour === 'descending';
            }),
            rest: [],
            ascending: globjects.filter(function(g) {
                return g.contour === 'ascending';
            }),
            all: retrogradeGlobjects // globjects.concat(retrogradeGlobjects) // TODO WHHYYYY
        };

        return score2.filter(function(d) {
            return d.pitched;
        }).map(function(d) {
            var globject = [];

            if (d.pitched.globjectContour !== 'all') {
                globject = getRandAndRemove(contours[d.pitched.globjectContour]);
            } else {
                for (var i = 0; i < (d.pitched.globjectCount || 1); i++) {
                    globject.push(VS.getItem(contours[d.pitched.globjectContour]));
                }
            }


            return {
                time: d.time,
                duration: d.pitched.duration,
                dynamics: d.pitched.dynamics,
                phraseType: d.pitched.phraseType,
                pitch: d.pitched.pitch,
                globjects: globject
            };
        });
    }

    part.init = function(parent) {
        bars = parent.selectAll('g')
            .data(coerceData())
            .enter()
            .append('g')
            .attr('transform', function(d) {
                return 'translate(' + (d.time * timeScale) + ',' + 0 + ')';
            });
    };

    part.draw = function() {
        drawGlobjects();
        drawPitchClasses();
        drawDynamics();
        drawRests();
    };

    var staticGlobject = VS.globject()
        .width(function(d) {
            return d.duration * timeScale;
        })
        .height(globjectHeight)
        .curve(d3.curveCardinalClosed.tension(0.3));

    function drawGlobjects() {
        bars
        .selectAll('.globject')
            .data(function(d) {
                return d.globjects.map(function(globject) {
                    globject.duration = d.duration;
                    globject.pitch = d.pitch;
                    globject.phraseType = d.phraseType;
                    return globject;
                });
            })
            .enter()
            .append('g')
            .attr('class', 'globject')
            .each(staticGlobject)
            .each(fillGlobject);
    }

    function drawPitchClasses() {
        bars.each(globjectText);
    }

    function drawDynamics() {
        bars.call(appendPitchedDynamics);
    }

    function drawRests() {
        var rest = bars.filter(function(d) {
            return d.phraseType === 'rest';
        })
        .append('text')
        .attr('class', 'rest');

        function getBarCenterX(d) {
            return d.duration * timeScale * 0.5;
        }

        rest.append('tspan')
            .attr('x', getBarCenterX)
            .attr('y', (globjectHeight * 0.5) - 20)
            .text('\ue4c6');

        rest.append('tspan')
            .attr('x', getBarCenterX)
            .attr('y', globjectHeight * 0.5)
            .text('\ue4e5');
    }

    return part;
}());
