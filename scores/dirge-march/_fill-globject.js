var fillGlobject = (function() {
    function fillGlobject(d) {
        var bar = d;
        var phraseType = bar.phraseType;
        var duration = bar.duration;
        var width = layout.scaleTime(duration);

        var content = d3.select(this).select('.globject-content');

        if (phraseType === 'ascending') {
            content.append('rect')
                .attr('width', width)
                .attr('height', globjectHeight + 10)
                .attr('fill', 'url(#ascending-fill)');
        }

        var lineCloud = VS.lineCloud()
            .duration(duration)
            // TODO shape over time for each PC set, not by a single set
            .phrase(makePhrase(phraseType, bar.pitch[0].classes))
            // .phrase(makePhrase(phraseType, bar.pitch[bar.pitch.length - 1].classes))
            .transposition('octave')
            .curve(d3.curveCardinal)
            .width(width)
            .height(globjectHeight);

        content.call(lineCloud, { n: Math.floor(duration) });

        content.selectAll('.line-cloud-path')
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', phraseType === 'ascending' ? '1' : 'none')
            .attr('fill', 'none');
    }

    function makePhrase(type, set) {
        function coin(prob) {
            return Math.random() < (prob || 0.5);
        }

        return function() {
            var notes = [],
                pc1, pc2;

            if (!type) {
                pc1 = VS.getItem(set) + config.semitoneTransposition;
                notes.push({ pitch: pc1, duration: VS.getRandExcl(8, 12) });
                notes.push({ pitch: pc1, duration: 0 });
            } else if (type === 'descending' || type === 'ascending') {
                pc1 = VS.getItem(set) + config.semitoneTransposition;
                pc2 = VS.getItem(set) + config.semitoneTransposition + (type === 'descending' ? -12 : 12);
                notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
                if (coin(0.33)) {
                    notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
                }
                if (coin(0.33)) {
                    notes.push({ pitch: pc2, duration: VS.getRandExcl(4, 6) });
                }
                notes.push({ pitch: pc2, duration: 0 });
            } else if (type === 'both') {
                notes.push({ pitch: VS.getItem(set) + config.semitoneTransposition, duration: VS.getRandExcl(4, 6) });
                notes.push({ pitch: VS.getItem(set) + config.semitoneTransposition + (coin() ? 12 : 0), duration: VS.getRandExcl(4, 6) });
                notes.push({ pitch: VS.getItem(set) + config.semitoneTransposition + (coin() ? 12 : 0), duration: 0 });
            }

            return notes;
        };
    }

    return fillGlobject;
}());
