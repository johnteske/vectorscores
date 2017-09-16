var score = [];

(function() {
    var n;

    function createGlobules(n) {
        var globules = [];

        for (var i = 0; i < n; i++) {
            globules.push(VS.getItem([1, 2, 4]));
        }

        return globules;
    }

    for(var i = 0; i < scoreLength; i++) {
        n = Math.floor(VS.getRandExcl(3, 64));

        score.push({
            type: VS.getItem(["glob", "chord", "rhythm"]),
            durations: createGlobules(n)
        });

        VS.score.add(i * globInterval, moveAndUpdate, [transitionTime.long, score[i]]);
    }
}());

// final event
VS.score.add(scoreLength * transitionTime.long, VS.noop);
