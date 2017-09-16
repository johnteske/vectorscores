var score = [];

(function() {
    var dynamics,
        lastIndex = scoreLength - 1;

    var globules0 = [],
        globules1 = [],
        globules2 = [];

    function randN() {
        return Math.floor(VS.getRandExcl(1, 21));
    }

    function createGlobules(globules, n) {
        globules = globules.slice(0, n);

        for (var i = 0; i < (n - globules.length); i++) {
            globules.push(VS.getItem([1, 2, 4]));
        }

        return globules;
    }

    for(var i = 0; i < scoreLength; i++) {
        globules0 = createGlobules(globules0, randN());
        globules1 = createGlobules(globules1, randN());
        globules2 = createGlobules(globules2, randN());

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
                    durations: globules0,
                },
                {
                    type: VS.getItem(["glob", "chord", "rhythm"]),
                    durations: globules1,
                },
                {
                    type: VS.getItem(["glob", "chord", "rhythm"]),
                    durations: globules2,
                }
            ],
            dynamics: dynamics
        });

        VS.score.add(i * globInterval, update, [transitionTime.long, score[i]]);
    }
}());

// final event
VS.score.add(scoreLength * transitionTime.long, VS.noop);
