---
layout: compress-js
---

var width = 480,
    height = width,
    txtWidth = width * 0.3, // remain fixed
    txtHeight = 180, // 220px from inspector
    margin = 12,
    transDur = 600,
    maxwidth = 480;

var main = d3.select('.main')
    .attr('width', width)
    .attr('height', height);

var txtWrapper = main.append('g') // for easy scrolling
    .attr('width', width)
    .attr('height', height);

{% include_relative _score.js %}

// var noteheads = VS.dictionary.Bravura.durations.stemless;

var ypointer = 0; // latest y position (not score index)
var lastPosition; // latest msg position

function texturalMsg(position) {
    var relPos = position === 'left' ? 0 : 1;

    if (relPos === lastPosition) {
        ypointer += txtHeight * 0.5;
    }

    var newGlobject = makeGlobject();
    var globject = VS.globject()
        .width(120)
        .height(120);

    // TODO remove need for g.wrapper
    var newTxt = txtWrapper.append('g').attr('class', 'wrapper')
        .selectAll('.globject')
        .data([newGlobject])
        .enter()
        .append('g')
        .style('opacity', 0) // fade
        .attr('transform', function() {
            // calc on maxwidth, is scaled later
            var x = relPos === 0 ? margin : (maxwidth - txtWidth - margin),
                y = ypointer + margin;
            return 'translate(' + x + ', ' + y + ')';
        })
        .each(globject);

    newTxt.selectAll('.globject-content')
        .insert('rect', ':first-child')
            .attr('fill', function(d) { return d.phraseTexture.length > 1 ? '#eee' : '#111'; })
            .attr('x', -20)
            .attr('width', 120 + 40)
            .attr('height', 127);

    newTxt.transition().duration(300)
        .style('opacity', 1); // fade

    ypointer += txtHeight * 0.5;
    lastPosition = relPos;

    scrollWrapper(transDur);
}

function scrollWrapper(dur) {
    var scale = (width / maxwidth);
    if ((ypointer + margin) > (height - margin)) {
        txtWrapper
            .transition()
            .attr('transform', function() {
                var x = 0,
                    y = height - ypointer - txtHeight;
                return 'scale(' + scale + ',' + scale + ')' +
                    'translate(' + x + ', ' + y + ')';
            })
            .duration(dur);
    } else {
        txtWrapper.attr('transform', 'scale(' + scale + ',' + scale + ')' );
    }
}


/**
 * Resize
 */
function resize() {
    width = Math.min(parseInt(d3.select('main').style('width'), 10), maxwidth);
    height = parseInt(d3.select('main').style('height'), 10);

    main
        .style('width', width + 'px')
        .style('height', height + 'px');
    scrollWrapper(0);
}

resize();

d3.select(window).on('resize', resize);


/**
 * Populate score
 */
(function() {
    var lastPos = ''; // TODO make these calculations in score

    for (var i = 0; i < 16; i++) {
        lastPos = VS.getWeightedItem([lastPos, lastPos === 'left' ? 'right' : 'left'], [0.2, 0.8]);
        VS.score.add(
            (i * 4000) + (2000 * Math.random()),
            texturalMsg,
            [lastPos]
        );
    }
})();

VS.score.preroll = 1000;

texturalMsg('left');
texturalMsg('right');
