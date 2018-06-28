---
layout: compress-js
---

// TODO since scenes can be cards or not cards, rename variables and CSS classes to match

var score = {
    totalDuration: 300, // 481 // originally timed for 481 s // NOTE does not scale chords--actual total duration may be longer
    cueBlinks: 2,
    transposeBy: 3
};

score.cueDuration = 3000; // NOTE this is the max cue timing
score.scale = 1;

{% include_relative _card-content.js %}
{% include_relative _score.js %}

var cues = [];

{% include_relative _options.js %}

var dynamicsDict = VS.dictionary.Bravura.dynamics;

// display
var cardWidth = 120,
    cardPadding = 24,
    cardTransTime = 600,
    offset = cardWidth + cardPadding,
    offsetY = 1,
    width = (cardWidth * 4) + (cardPadding * 2),
    height = cardWidth * 2.5;

var svg = d3.select('.main');

var scaleDuration = (function() {
    var scale = score.totalDuration / 481;

    return function(i) {
        var dur = cardList[i].duration;
        // do not scale chords (2-3 s)
        return dur < 4 ? dur : dur * scale;
    };
})();

function cardX(index) {
    return index * (cardWidth + cardPadding) * score.scale;
}

function makeCue(data, index) {
    var selection = d3.select(this);

    var symbols = {
        // \ue890 // cue
        1: '\ue893', // weak cue
        2: '\ue894', // 2 beat
        3: '\ue895' // 3 beat
        // \ue896 // 4 beat
        // \ue89a // free
    };

    selection
        .attr('class', 'cue bravura')
        .attr('transform', 'translate(' + cardX(index) + ', 100)')
        .attr('dy', '-2em')
        .style('text-anchor', data.cue ? 'start' : 'middle')
        .style('fill', '#888')
        .text(symbols[data.cue]);

    cues[index] = VS.cueBlink(selection)
        .beats(data.cue)
        .inactive(function(selection) {
            selection
                .style('fill', '#888')
                .style('opacity', 1);
        })
        .on(function(selection) {
            selection
                .style('fill', 'blue')
                .style('opacity', 1);
        })
        .off(function(selection) {
            selection
                .style('fill', '#888')
                .style('opacity', 0.25);
        })
        // Do not blink on downbeat--card position animation signals downbeat
        .down(function(selection) {
            selection
                .style('fill', '#888')
                .style('opacity', 0.25);
        })
}

function makeCard(data, index) {
    var selection = d3.select(this);

    selection.append('text')
        .attr('class', 'card-duration')
        .attr('dy', '-2.5em')
        .text(scaleDuration(index).toFixed(1) + '\u2033');

    if (data.timbre) {
        selection.append('text')
            .attr('class', 'card-timbre')
            .attr('x', cardWidth)
            .attr('dy', '-2.5em')
            .style('text-anchor', 'end')
            .text(data.timbre);
    }

    selection.append('text')
        .attr('dy', '-1em')
        .text(function(d) {
            var transpose = (typeof d.transpose !== 'undefined') ? (d.transpose + score.transposeBy) : 'random';
            var pcSet = VS.pitchClass.transpose(d.pcSet, transpose + scoreOptions.transposition);

            pcSet = pcSet.map(function(pc) {
                return VS.pitchClass.format(pc, scoreOptions.pitchClasses.display, scoreOptions.pitchClasses.preference);
            });

            return '{' + pcSet.join(',') + '}';
        })
        .classed('pitch-class-set', 1);

    var card = selection.append('g');

    if (data.type === 'card') {
        card.append('rect')
            .attr('width', cardWidth)
            .attr('height', cardWidth);
    } else {
        card.append('line')
            .attr('class', 'barline')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', cardWidth);
    }

    for (var ci = 0; ci < data.content.length; ci++) {
        var content = data.content[ci];
        card.call(content.type, content.args);
    }

    selection.append('g')
        .attr('class', 'dynamics')
        .attr('transform', 'translate(0, ' + cardWidth + ')')
        .selectAll('text')
        .data(function(d) {
            return d.dynamics;
        })
        .enter()
        .append('text')
        .attr('x', function(d) {
            return d.time * cardWidth;
        })
        .attr('text-anchor', function(d) {
            var anchor = 'start';

            if (d.time === 0.5) {
                anchor = 'middle';
            } else if (d.time === 1) {
                anchor = 'end';
            }

            return anchor;
        })
        .attr('dx', function(d) {
            return d.time === 0 ? '0.125em' : 0;
        })
        .attr('dy', '1em')
        .text(function(d) { return dynamicsDict[d.value]; });
}

// create cards
function translateCardGroup(pointer) {
    var i = pointer || 0;
    return 'translate(' + (offset - cardX(i)) + ', ' + offsetY + ') scale(' + score.scale + ',' + score.scale + ')';
}

var cardGroup = svg.append('g')
    .attr('transform', translateCardGroup);

var cards = cardGroup.selectAll('.card')
    .data(cardList)
    .enter()
    .append('g')
    .classed('card', 1)
    .each(makeCard)
    .attr('transform', function(d, i) { return 'translate(' + cardX(i) + ', 100)'; })
    .style('opacity', function(d, i) { return 1 - (i * (0.5)); });

// create cues
cardGroup.append('g')
    .attr('class', 'cues')
    .selectAll('.cue')
    .data(cardList)
    .enter()
    .append('text')
    .each(makeCue)
    .call(showNextCue, 0, 0);

function showNextCue(selection, pointer, dur) {
    selection
        .transition()
        .duration(dur)
        .style('opacity', function(d, i) {
            return i === (pointer + 1) ? 1 : 0;
        });
}

function fadePenultimateScene(active, dur) {
    cards.filter(function(d, i) {
        return i === (cardList.length - 1);
    })
    .style('opacity', 1)
    .transition().duration(dur)
    .style('opacity', active ? 0 : 1);
}

function goToCard(index, control) {
    var pointer = (typeof index !== 'undefined') ? index : VS.score.getPointer();
    var dur = cardTransTime;
    cardGroup.transition()
        .duration(dur)
        .attr('transform', function() {
            return translateCardGroup(pointer);
        });

    d3.selectAll('.cue').call(showNextCue, pointer, dur);

    cards.transition()
        .duration(dur)
        .style('opacity', function(d, i) {
            // if rolling back to begin play, hide previous cards
            var p = control === 'play' ? pointer + 1 : pointer;

            if (p > i) {
                return 0;
            }
            else {
                return (0.5 * (pointer - i)) + 1;
            }
        })
        .on('end', function() {
            // if penultimate scene, fade
            if (VS.score.getPointer() === (VS.score.getLength() - 2) && control === 'score') {
                fadePenultimateScene(true, (scaleDuration(pointer) * 1000) - dur);
            }
        });

    // if playing and not skipping, stopping
    // if (control === 'score') { updateCardIndicator(index); } // cue all
    // if (control === 'score' && cardList[pointer + 1].cue) { updateCardIndicator(index); } // only cue if set in score
    if (control === 'score') { scheduleCue(index); }
}

function cueBlink(pointer) {
    cues[pointer + 1].start();
}

function cueCancelAll() {
    for (var i = 0; i < cues.length; i++) {
        cues[i].cancel();
    }
}

function scheduleCue(pointer) {
    // do not schedule if penultimate scene
    if (VS.score.getPointer() === (VS.score.getLength() - 2)) {
        return;
    }

    var cardDuration = VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer),
        nextCue = cues[pointer + 1],
        cueDelay = cardDuration - nextCue.duration();

    VS.score.schedule(cueDelay, cueBlink, pointer);
}

var addEvent = (function() {
    var time = 0;

    return function(fn, duration, args) {
        VS.score.add(time, fn, args);
        time += duration;
    };
})();

// create score events from card durations
for (var i = 0; i < cardList.length; i++) {
    addEvent(goToCard, scaleDuration(i) * 1000, [i, 'score']);
}

// and final, empty event after last card
addEvent();

VS.score.preroll = score.cueDuration; // cardTransTime;

VS.control.hooks.add('play', function() {
    var pointer = VS.score.getPointer();
    goToCard(pointer - 1, 'play');
    // VS.score.schedule(VS.score.preroll - score.cueDuration, cueBlink);
    VS.score.schedule(VS.score.preroll - cues[pointer].duration(), cueBlink, pointer - 1);
});

function cancelAndGoToCard() {
    cueCancelAll();
    d3.selectAll('.cue').style('opacity', 0);
    fadePenultimateScene(false, 0);
    goToCard();
}
VS.control.hooks.add('pause', cancelAndGoToCard);
VS.control.hooks.add('stop', cancelAndGoToCard);

VS.control.hooks.add('step', goToCard);

/**
 * Resize
 */
function resize() {
    var main = d3.select('main');

    var w = parseInt(main.style('width'), 10);
    var h = parseInt(main.style('height'), 10);

    var scaleX = VS.clamp(w / width, 0.25, 4);
    var scaleY = VS.clamp(h / height, 0.25, 4);

    score.scale = Math.min(scaleX, scaleY);

    offset = (w * 0.5) - (cardWidth * score.scale);
    offsetY = (h * 0.5) - (height * 0.5 * score.scale);

    cardGroup.attr('transform', translateCardGroup);
}

resize();

d3.select(window).on('resize', resize);
