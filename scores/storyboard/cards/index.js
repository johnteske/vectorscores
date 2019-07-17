var cardTypes, cardList;

cardTypes = {
    'A': {
        numberOfNotes: [1, 5], // low limit, high limit
        dynamics: ['pp', 'p', 'mp'],
        spread: {x: 0, y: 0}, // single note
        pcSet: [0, 1, 3]
    },
    'B': {
        numberOfNotes: [1, 10],
        dynamics: ['p', 'mp'],
        spread: {x: 0, y: 25}, // chord, cluster
        pcSet: [0, 1, 4]
    },
    'C': {
        numberOfNotes: [6, 15],
        dynamics: ['mp', 'mf'],
        spread: {x: 50, y: 0}, // rhythm
        pcSet: [0, 1, 5]
    },
    'D': {
        numberOfNotes: [11, 20],
        dynamics: ['mf', 'f'],
        spread: {x: 50, y: 25}, // rect cloud
        pcSet: [0, 2, 5]
    },
    'E': {
        numberOfNotes: [16, 25],
        dynamics: ['f', 'ff', 'fff'],
        spread: {x: 35, y: 35}, // cloud
        pcSet: [0, 2, 6]
    }
};

function makeCards(nCards) {
    var _cards = [],
        _cardTypeKeys = ['A', 'B', 'C', 'D', 'E']; // Object.keys(cardTypes);

    for (var i = 0; i < nCards; i++) {
        var thisCard = {},
            thisCardType,
            prevCard = _cards[i - 1] || { time: 0 };

        // set unique type
        do {
            thisCard.type = VS.getItem(_cardTypeKeys);
        } while (thisCard.type === prevCard.type);

        thisCardType = cardTypes[thisCard.type];

        // set card start time
        thisCard.time = prevCard.time + VS.getRandExcl(5000, 8000);
        // thisCard.duration // could also/instead set duration for each card

        thisCard.nnotes = Math.floor(VS.getRandExcl(
            thisCardType.numberOfNotes[0], thisCardType.numberOfNotes[1]
        ));

        thisCard.spread = thisCardType.spread;

        thisCard.dynamic = VS.getItem(thisCardType.dynamics);

        thisCard.pcSet = VS.pitchClass.transpose(thisCardType.pcSet, 'random');

        _cards.push(thisCard); // console.log(thisCard);
    }
    return _cards;
}

cardList = makeCards(12);
var scoreSettings = (function() {
    var generateButton = document.getElementById('settings-generate'),
        radioSetting = new VS.RadioSetting(document.getElementsByName('settings-pc-display'));

    var settings = {};

    settings.pcFormat = VS.getQueryString('pcs') || '';
    radioSetting.set(settings.pcFormat);

    generateButton.addEventListener('click', function() {
        document.location.href = '?pcs=' + radioSetting.get();
    });

    return settings;
})();

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
    .inactive(function(selection) {
        selection
            .style('fill-opacity', 0)
            .style('opacity', 0);
    })
    .on(function(selection) {
        selection
            .style('fill-opacity', 1)
            .style('opacity', 1);
    })
    .off(function(selection) {
        selection.style('fill-opacity', 0);
    })
    .down(function(selection) {
        selection
            .style('fill-opacity', 1)
            .style('opacity', 1);
    });

function goToCard(eventIndex, dur) {
    var pointer = eventIndex || VS.score.getPointer();
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
    var cardDuration = cardList[pointer + 1].time - cardList[pointer].time;
    var indicatorTime = cardDuration - cueIndicator.duration();

    VS.score.schedule(indicatorTime, cueIndicator.start);
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
