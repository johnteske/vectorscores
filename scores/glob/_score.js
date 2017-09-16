var score = [];

(function() {
    var n,
        dynamics,
        lastIndex = scoreLength - 1;

    function createGlobules(n) {
        var globules = [];

        for (var i = 0; i < n; i++) {
            globules.push(VS.getItem([1, 2, 4]));
        }

        return globules;
    }

    for(var i = 0; i < scoreLength; i++) {
        n = Math.floor(VS.getRandExcl(1, 21));

        if (i === 0) {
            dynamics = "<";
        } else if (i === lastIndex) {
            dynamics = ">";
        } else {
            dynamics = VS.getItem(["pp", "p", "mp", "mf", "f", "ff"]);
        }

        score.push({
            globs: [
                {
                    type: VS.getItem(["glob", "chord", "rhythm"]),
                    durations: createGlobules(n),
                },
                {
                    type: VS.getItem(["glob", "chord", "rhythm"]),
                    durations: createGlobules(n),
                },
                {
                    type: VS.getItem(["glob", "chord", "rhythm"]),
                    durations: createGlobules(n),
                }
            ],
            dynamics: dynamics
        });

        VS.score.add(i * globInterval, update, [transitionTime.long, score[i]]);
    }
}());

// final event
VS.score.add(scoreLength * transitionTime.long, VS.noop);
