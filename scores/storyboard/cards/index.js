---
layout: compress-js
---

var cardTypes, cardList;

{% include_relative _score.js %}
{% include_relative _settings.js %}

var dynamicsDict = VS.dictionary.Bravura.dynamics,
    durationDict = VS.dictionary.Bravura.durations.stemless;

// display
var cardWidth = 120,
    cardPadding = 10,
    cardTransTime = 600,
    offset = cardWidth,
    width = (cardWidth * 4) + (cardPadding * 2),
    height = cardWidth * 3;

var main = d3.select('.main')
    .attr('width', width)
    .attr('height', height);

function newPoint(spread) {
    var angle = Math.random() * Math.PI * 2;
    return {
        x: Math.cos(angle) * spread.x * VS.getRandExcl(-1, 1),
        y: Math.sin(angle) * spread.y * VS.getRandExcl(-1, 1)
    };
}
function cardX(index) {
    return index * (cardWidth + cardPadding);
}

function makeCard(selection) {
    selection.append('rect')
        .attr('width', cardWidth - 1)
        .attr('height', cardWidth - 1);

    selection.each(function(d) {
        var nnotes = d.nnotes,
            spread = d.spread;

        d3.select(this).selectAll('.duration')
            .data(d3.range(0, nnotes))
            .enter()
            .append('text')
            .attr('class', 'duration')
            .text(durationDict['1'])
            .attr('transform', function() {
                var point = newPoint(spread);
                return 'translate(' +
                    (point.x + (cardWidth * 0.5)) + ', ' +
                    (point.y + (cardWidth * 0.5)) + ')';
            });
    });

    selection.append('text')
        .attr('dy', '-1em')
        .text(function(d) {
            var pcSet = d.pcSet.map(function(pc) {
                return VS.pitchClass.format(pc, scoreSettings.pcFormat);
            });
            return '{' + pcSet.join(', ') + '}';
        })
        .classed('pitch-class-set', 1);

    selection.append('text')
        .attr('y', cardWidth)
        .attr('dx', '0.125em')
        .attr('dy', '1em')
        .text(function(d) { return dynamicsDict[d.dynamic]; })
        .classed('dynamics', 1);
}
// create cards
var cardGroup = main.append('g')
    .attr('transform', 'translate(' + offset + ', 0)');
var cards = cardGroup.selectAll('.card')
    .data(cardList)
    .enter()
    .append('g')
    .classed('card', 1)
    .call(makeCard)
    .attr('transform', function(d, i) { return 'translate(' + cardX(i) + ', 100)'; })
    .style('opacity', function(d, i) { return 1 - (i * (0.5)); });

var cueTriangle = main.append('path')
    .attr('class', 'indicator')
    .attr('d', 'M-6.928,0 L0,2 6.928,0 0,12 Z')
    .style('stroke', 'black')
    .style('stroke-width', '1')
    .style('fill', 'black')
    .style('fill-opacity', '0')
    .attr('transform', 'translate(' + (cardX(1) + offset) + ', 50)') // put at right card position
    .style('opacity', '0');

var cueIndicator = VS.cueBlink(cueTriangle)
    .beats(3)
    .on(function(selection) {
        selection.style('fill-opacity', 1)
            .style('opacity', 1);
    })
    .off(function(selection) {
        selection.style('fill-opacity', 0);
    })
    .end(function(selection) {
        selection.style('fill-opacity', 0)
            .style('opacity', 0);
    });

function goToCard(eventIndex, dur) {
    var pointer = eventIndex || VS.score.pointer;
    dur = dur || cardTransTime;
    cardGroup.transition()
        .duration(dur)
        .attr('transform', function() {
            var x = offset - cardX(pointer);
            return 'translate(' + x + ', 0)';
        });

    cards.transition()
        .duration(dur)
        .style('opacity', function(d, i) {
            if (pointer > i ) {
                return 0;
            }
            else {
                return (0.5 * (pointer - i)) + 1;
            }
        });

    // if playing and not skipping, stopping
    if (typeof eventIndex !== 'undefined') { updateCardIndicator(eventIndex); }
}

function updateCardIndicator(pointer) {
    var cardDuration = VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer),
        indicatorTime = cardDuration - cueIndicator.duration();

    VS.score.schedule(indicatorTime, function() {
        cueIndicator.start();
    });
}

// create score events from card times
for (var i = 0; i < cardList.length; i++) {
    VS.score.add(cardList[i].time, goToCard, [i]);
}
// and final, empty event 3 seconds after last card
VS.score.add(cardList[cardList.length - 1].time + 3000);

function cancelAndGoToCard() {
    cueIndicator.cancel();
    goToCard();
}

VS.control.hooks.add('step', cancelAndGoToCard);
VS.control.hooks.add('pause', cancelAndGoToCard);
VS.score.hooks.add('stop', cancelAndGoToCard);
