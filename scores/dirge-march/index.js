---
layout: compress-js
---

// TODO scroll globject layer (and percussion dynamics) to show duration of phrases and transformation over time
// rhythms would be still be generated in boxes but could be cued in and out CueSymbol#blink
// may also solve issues of multiple globjects, timing, transitions

var width = 480,
    height = 480,
    globjectWidth = 240,
    globjectHeight = 90,
    debug = +VS.getQueryString('debug') === 1 || false,
    transposeBy = 2,
    layout = {
        scale: 1,
        margin: {
            left: 0,
            top: 0
        },
        globjects: {
            top: 16
        },
        perc: {
            y: 220,
            y1: 16,
            y2: 60 + 16,
            dynamics: 60 + 60 + 24
        }
    };

// TODO a temporary solution to update rhythms within bars--eventually add specific rhythm selections/option to score
// var updateTimeout;
// var updateInterval = 8000;

var dynamics = VS.dictionary.Bravura.dynamics;

// Wrap in IIFE to aid in linting
var globjects = (function() {
    return {% include_relative _globjects.json %};
}());

{% include_relative _globjects.js %}
{% include_relative _rhythms.js %}
{% include_relative _score.js %}
{% include_relative _settings.js %}

var svg = d3.select('svg');

var wrapper = svg.append('g')
    .attr('class', 'wrapper')
    .classed('debug', debug);
    // .attr('transform', 'translate(' + layout.margin.left + ',' + layout.margin.top + ')');

var globjectContainer = wrapper.append('g')
    .attr('class', 'globjects')
    .attr('transform', 'translate(0,' + layout.globjects.top + ')');

var durationText = globjectContainer.append('text')
    .attr('class', 'duration-text')
    .attr('dy', '-3em');

/**
 * Rhythm test
 */
var percussionParts = wrapper.append('g')
    .attr('transform', 'translate(' + 0 + ',' + layout.perc.y + ')')
    .attr('class', 'percussion-parts');

var tempoText = percussionParts.append('text')
    .attr('class', 'tempo-text');

tempoText.append('tspan')
    .text(stemmed['1']);

var perc1 = percussionParts.append('g')
    .attr('transform', 'translate(' + 0 + ',' + layout.perc.y1 + ')');

var perc2 = percussionParts.append('g')
    .attr('transform', 'translate(' + 0 + ',' + layout.perc.y2 + ')');

percussionParts.selectAll('g').call(function(selection) {
    selection.append('text')
        .style('font-family', 'Bravura')
        .attr('x', -22)
        .attr('y', 22)
        .text('\ue069');

    function createRhythmCell(g) {
        var cell = g.append('g')
            // .attr('transform', 'translate(' + 22 + ',' + 0 + ')')
            .attr('class', 'rhythm');

        cell.append('rect')
            .attr('height', 45)
            .attr('stroke', '#888')
            .attr('fill', 'none');

        cell.append('text')
            .attr('dx', 11)
            .attr('y', 35);
    }

    // create two rhythm cells
    selection.call(createRhythmCell);
    selection.call(createRhythmCell);
});

var percDynamics = percussionParts.append('g')
    .attr('transform', 'translate(0,' + layout.perc.dynamics + ')');

function textAnchor(t) {
    var a = 'middle';

    if (t === 0) {
        a = 'start';
    } else if (t === 1) {
        a = 'end';
    }

    return a;
}

var globject = VS.globject()
    .width(globjectWidth)
    .height(globjectHeight)
    .curve(d3.curveCardinalClosed.tension(0.3));

/**
 *
 */
function makePhrase(type, set) {
    function coin(prob) {
        return Math.random() < (prob || 0.5);
    }

    return function() {
        var notes = [],
            pc1, pc2;

        if (!type) {
            pc1 = VS.getItem(set) + transposeBy;
            notes.push({ pitch: pc1, duration: VS.getRandExcl(8, 12) });
            notes.push({ pitch: pc1, duration: 0 });
        } else if (type === 'descending' || type === 'ascending') {
            pc1 = VS.getItem(set) + transposeBy;
            pc2 = VS.getItem(set) + transposeBy + (type === 'descending' ? -12 : 12);
            notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
            if (coin(0.33)) {
                notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
            }
            if (coin(0.33)) {
                notes.push({ pitch: pc2, duration: VS.getRandExcl(4, 6) });
            }
            notes.push({ pitch: pc2, duration: 0 });
        } else if (type === 'both') {
            notes.push({ pitch: VS.getItem(set) + transposeBy, duration: VS.getRandExcl(4, 6) });
            notes.push({ pitch: VS.getItem(set) + transposeBy + (coin() ? 12 : 0), duration: VS.getRandExcl(4, 6) });
            notes.push({ pitch: VS.getItem(set) + transposeBy + (coin() ? 12 : 0), duration: 0 });
        }

        return notes;
    };
}

var pattern = svg.append('defs')
    .append('pattern')
    .attr('id', 'ascending-fill')
    .attr('width', 2)
    .attr('height', 2)
    .attr('patternUnits', 'userSpaceOnUse');

pattern.append('circle')
    .attr('fill', '#eee')
    .attr('r', 1);

/**
 *
 */
function update(index, isControlEvent) {
    var bar = score[index];

    /**
     * Globjects
     */
    d3.selectAll('.globject').remove();

    globjectContainer.selectAll('.globject')
        .data(bar.pitched.globjects)
        .enter()
        .append('g')
        .each(globject)
        .each(function(d) {
            var content = d3.select(this).select('.globject-content');

            if (bar.pitched.phraseType === 'ascending') {
                content.append('rect')
                    .attr('width', d.width)
                    .attr('height', globjectHeight + 10)
                    .attr('fill', 'url(#ascending-fill)');
            }

            var lineCloud = VS.lineCloud()
                .duration(bar.pitched.duration)
                // TODO shape over time for each PC set, not by last set
                .phrase(makePhrase(bar.pitched.phraseType, bar.pitched.pitch[bar.pitched.pitch.length - 1].classes))
                .transposition('octave')
                .curve(d3.curveCardinal)
                .width(d.width)
                .height(globjectHeight);

            content.call(lineCloud, { n: Math.floor(bar.pitched.duration) });

            content.selectAll('.line-cloud-path')
                .attr('stroke', 'grey')
                .attr('stroke-dasharray', bar.pitched.phraseType === 'ascending' ? '1' : 'none')
                .attr('fill', 'none');
        })
        .each(function(d) {
            var selection = d3.select(this);

            var g = selection.append('g'),
                pitch = bar.pitched.pitch,
                text;

            for (var i = 0; i < pitch.length; i++) {
                text = g.append('text')
                    .attr('dy', '-1.5em')
                    .attr('x', pitch[i].time * d.width)
                    .attr('text-anchor', textAnchor(pitch[i].time));

                var set = VS.pitchClass.transpose(pitch[i].classes, transposeBy).map(function(pc) {
                    return VS.pitchClass.format(pc, scoreSettings.pcFormat);
                });
                var formatted = '{' + set + '}';

                text.text(formatted)
                    .attr('class', 'pitch-class');
            }

            /**
             * Dynamics
             */
            if (bar.pitched.dynamics) {
                selection.append('g')
                    .attr('transform', 'translate(0,' + globjectHeight + ')')
                    .selectAll('.dynamic')
                    .data(bar.pitched.dynamics)
                    .enter()
                    .append('text')
                        .attr('class', 'dynamic')
                        .attr('x', function(d, i) {
                            return globjectWidth * d.time;
                        })
                        .attr('dy', '1em')
                        .attr('text-anchor', function(d) {
                            return textAnchor(d.time);
                        })
                        .text(function(d) {
                            return dynamics[d.value];
                        });
            }
        });

    /**
     * Duration
     */
    durationText.text(bar.pitched.duration + (bar.pitched.duration ? '\u2033' : ''));

    /**
     * Rest
     */
    var rest = d3.select('.rest').remove();

    if (bar.pitched.phraseType === 'rest') {
        rest = globjectContainer.append('text')
            .attr('class', 'rest');
        rest.append('tspan')
            .attr('x', globjectWidth * 0.5)
            .attr('y', (globjectHeight * 0.5) - 20)
            .text('\ue4c6');
        rest.append('tspan')
            .attr('x', globjectWidth * 0.5)
            .attr('y', globjectHeight * 0.5)
            .text('\ue4e5');
    }

    /**
     * Tempo
     */
    var tempo = bar.percussion.tempo;

    tempoText.select('.bpm').remove();

    tempoText.append('tspan')
        .attr('class', 'bpm')
        .text(' = ' + tempo);

    percussionParts
        // .transition().duration(300) // TODO fade in/out as part of event, not on start of event
        .style('opacity', tempo ? 1 : 0);

    /**
     * Rhythms
     * TODO stash creation functions elsewhere?
     * NOTE tempo and bar are in update scope
     */
    function createRhythm() {
        var selection = d3.select(this),
            textEl = selection.select('text');

        textEl.selectAll('tspan').remove();

        if (!tempo) {
            return;
        }

        var extent = bar.percussion.rhythmRange;
        var randRhythm = VS.getItem(rhythms.filter(function(r, i) {
            var inRange = extent[0] <= i && i <= extent[1];
            return r !== percRhythm && inRange; // prevent duplicates within each part
        }));

        percRhythm = randRhythm;

        var symbols = randRhythm.split(',');

        for (var si = 0; si < symbols.length; si++) {
            var symbol = symbols[si],
                spacing = 0,
                dy = symbol === 'r0.5' || symbol === 'r0.5.' ? 0.4 : 0;

            if (symbol === 'trip') {
                spacing = -6;
            } else if (symbol === '1.') {
                spacing = -5;
            }

            textEl.append('tspan')
                .style('letter-spacing', spacing)
                .style('baseline-shift', dy + 'em')
                .text(stemmed[symbol]);
        }

        var textWidth = textEl.node().getBBox().width;
        // TODO set d.width

        selection.select('rect').attr('width', textWidth + 22);
    }

    function spacePerc(d, i) {
        var selection = d3.select(this);

        var width = selection.node().getBBox().width;
        var xOffset = percPos + (i * 11);
        percPos += width;
        // TODO get d.width

        selection.attr('transform', 'translate(' + xOffset + ',' + 0 + ')');
    }

    var percPos = 0;
    var percRhythm = '';
    perc1.selectAll('.rhythm')
        .each(createRhythm)
        .each(spacePerc);

    percPos = 0;
    percRhythm = '';
    perc2.selectAll('.rhythm')
        .each(createRhythm)
        .each(spacePerc);

    /**
     * Percussion dynamics
     */
    percDynamics.selectAll('.dynamic').remove();

    if (bar.percussion.dynamics) {
        percDynamics.selectAll('.dynamic')
            .data(bar.percussion.dynamics)
            .enter()
            .append('text')
                .attr('class', 'dynamic')
                .attr('x', function(d, i) {
                    return globjectWidth * d.time;
                })
                .attr('text-anchor', function(d) {
                    return textAnchor(d.time);
                })
                .text(function(d) {
                    return dynamics[d.value];
                });
    }

    // // TODO
    // if (!isControlEvent) {
    //     updateTimeout = window.setTimeout(function() { update(index); }, updateInterval);
    // } else {
    //     window.clearTimeout(updateTimeout);
    // }
}

/**
 * Resize
 */
function resize() {
    var main = d3.select('main');

    var w = parseInt(main.style('width'), 10);
    var h = parseInt(main.style('height'), 10);

    var scaleX = VS.clamp(w / width, 0.25, 2);
    var scaleY = VS.clamp(h / height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = (w * 0.5) - (120 * layout.scale);
    layout.margin.top = (h * 0.5) - ((height * 0.5 - 72) * layout.scale);

    wrapper.attr('transform', 'translate(' + layout.margin.left + ',' + layout.margin.top + ') scale(' + layout.scale + ',' + layout.scale + ')');
}

d3.select(window).on('resize', resize);

/**
 * Populate score
 */
for (var i = 0; i < score.length; i++) {
    VS.score.add(score[i].time * 1000, update, [i]);
}

/**
 * Initialize score
 */
d3.select(window).on('load', function() {
    resize();
    update(0, true);
});

/**
 * Score controls
 */
(function() {
    var controlCallback = function() {
        // console.log('mm. ' + (VS.score.pointer + 1));
        update(VS.score.pointer, true);
    }

    VS.control.hooks.add('stop', controlCallback);
    VS.control.hooks.add('pause', controlCallback);
    VS.control.hooks.add('step', controlCallback);
})();
