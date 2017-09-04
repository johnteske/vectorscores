/**
 * TODO proto globjects are combined into phrases, not directly used
 */
var score = (function(score) {
    var tempo = "",
        selected;

    /**
     * dirge
     */
    tempo = "60";

    var descending = globjects.filter(function(g) {
        return g.contour === "descending";
    });

    for (var i = 0; i < 3; i++) {
        selected = [VS.getItem(descending)];
        score.push({
            duration: 3,
            globjects: selected,
            tempo: tempo
        });
    }

    /**
     *
     */
    tempo = "";

    var ascending = globjects.filter(function(g) {
        return g.contour === "ascending";
    });

    selected = [VS.getItem(ascending)];
    score.push({
        duration: 6,
        globjects: selected,
        tempo: tempo
    });

    /**
     * march
     * TODO select multiple (will need to pass all score events as array)
     */
    tempo = "120";

    var allGlobjects = globjects.concat(retrogradeGlobjects);

    for (i = 0; i < 6; i++) {
        selected = [VS.getItem(allGlobjects)];
        score.push({
            duration: 3,
            globjects: selected,
            tempo: tempo
        });
    }

    return score;
})([]);
