var chord = (function() {
    var timeSigs = {
        '2/4': '\uf589',
        '3/4': '\uf58c'
    };

    function makeChord(selection, args, x) {
        var range = [0, 1, 2, 3, 4, 5],
            rangeHalf = range.length * 0.5,
            notehead = '\uf46a';

        var stemX = x + 7.875;
        var flagX = x + 7.35;

        if (args.sustain) {
            notehead = '\uf468';
        } else if (args.duration === 1.5) {
            notehead = '\uf46a\u2009\uf477'; // &thinsp; + Bravura dot
        }

        function y(d) {
            return (cardWidth * 0.5) + ((d - rangeHalf) * 10) + 5;
        }

        if (args.sustain) {
            // fermata
            selection.append('text')
                .attr('class', 'chord-fermata')
                .attr('x', x)
                .attr('y', y(0))
                .attr('dy', -15)
                .text('\ue4c6');
        } else {
            // stem
            selection.append('line')
                .attr('stroke', 'black')
                .attr('x1', stemX)
                .attr('y1', y(5))
                .attr('x2', stemX)
                .attr('y2', y(0) - 20);

            // accent
            selection.append('text')
                .attr('class', 'chord-art')
                .attr('x', x)
                .attr('y', y(5))
                .attr('dy', 15)
                .text('\uf475');

            // rest
            selection.append('text')
                .attr('class', 'time-sig')
                .attr('x', args.duration ? (x + 40) : (x + 16))
                .attr('y', cardWidth * 0.5)
                .text('\ue4e6');
        }

        if (!args.sustain && args.duration !== 1.5) {
            // flag
            selection.append('text')
                .attr('class', 'chord-flag')
                .attr('text-anchor', 'start')
                .attr('x', flagX)
                .attr('y', y(0) - 24)
                .text('\uf48b');
                // .text("\uf48d"); // sixteenth
        }

        var text = selection.append('text')
            .attr('text-anchor', args.sustain ? 'middle' : 'start')
            .attr('class', 'chord');

        text.selectAll('tspan')
            .data(range)
            .enter()
            .append('tspan')
                .attr('x', x)
                .attr('y', y)
                .text(notehead);
    }

    return function(selection, args) {
        var center = cardWidth * 0.5,
            marginLeft = 36,
            spacing = (cardWidth - marginLeft) / (args.n + 1);

        function x(i) {
            return marginLeft + (i * spacing);
        }

        if (args.timeSig) {
            selection.append('text')
                .attr('class', 'time-sig')
                .attr('dx', 6)
                .attr('y', cardWidth * 0.5)
                .attr('dy', 12)
                .text(timeSigs[args.timeSig]);
        }

        if (args.sustain) {
            selection.call(makeChord, args, center);
        } else {
            for (var i = 0; i < args.n; i++) {
                selection.call(makeChord, args, x(i));
            }
        }

        if (!args.sustain && args.duration !== 1.5) {
            selection.append('text')
                .attr('class', 'time-sig')
                .attr('x', x(args.n))
                .attr('y', cardWidth * 0.5)
                .text('\ue4e5');
        }
    };
})();

function lnp(selection) {
    var margin = 11;

    selection.append('text')
        .attr('class', 'lnp')
        .attr('x', 0)
        .attr('y', cardWidth)
        .attr('dx', margin)
        .attr('dy', -margin)
        .text('\ue0f4');

    selection.append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .attr('x1', margin + 4)
        .attr('x2', cardWidth - margin)
        .attr('y1', cardWidth - margin - 2)
        .attr('y2', cardWidth - margin - 2);
}

/**
 * TODO pass in margin to prevent overlap with LNP
 */
function lines(selection, args) {
    var lineCloud = VS.lineCloud()
        .duration(args.duration || 1)
        .phrase(args.phrase || [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }])
        .curve(args.curve || d3.curveLinear)
        .width(cardWidth)
        .height(cardWidth - (args.bottomMargin || 0));

    selection.call(lineCloud, { n: args.n });

    // test styling
    selection.selectAll('.line-cloud-path')
        .attr('stroke', 'grey')
        .attr('fill', 'none');
}

function microMelodyPhrase() {
    var notes = [
        { pitch: 0, duration: 1 },
        { pitch: 0, duration: 0 }
    ];

    var dir = VS.getItem([-1, 1]);

    notes.push({ pitch: 2 * dir, duration: 1 });
    notes.push({ pitch: 2 * dir, duration: 0 });

    dir = dir === -1 ? 1 : -1;

    notes.push({ pitch: 2 * dir, duration: 1 });
    notes.push({ pitch: 2 * dir, duration: 0 });

    return notes;
}

function melodyPhrase() {
    var notes = [
        { pitch: 0, duration: 1 },
        { pitch: 0, duration: 0 }
    ];

    function addNote() {
        var dir = VS.getItem([-1, 1]);
        notes.push({ pitch: 2 * dir, duration: 1 });
        notes.push({ pitch: 2 * dir, duration: 0 });
    }

    for (var i = 0; i < 5; i++) {
        addNote();
    }

    return notes;
}

function microtonalPhrase() {
    var notes = [
        { pitch: 0, duration: 1 }
    ];

    function addNote() {
        var dir = VS.getItem([-1, 1]);
        notes.push({ pitch: dir, duration: 1 });
    }

    for (var i = 0; i < 5; i++) {
        addNote();
    }

    notes.push({ pitch: 0, duration: 0 });

    return notes;
}
