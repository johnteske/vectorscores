/**
 * TODO proto globjects are combined into phrases, not directly used
 */
var score = (function(score) {
    var selected;

    /**
     * dirge
     */
    var descending = globjects.filter(function(g) {
        return g.contour === "descending";
    });

    for (var i = 0; i < 3; i++) {
        selected = [VS.getItem(descending)];
        score.push(selected);
    }

    /**
     *
     */
    var ascending = globjects.filter(function(g) {
        return g.contour === "ascending";
    });

    selected = [VS.getItem(ascending)];
    score.push(selected);

    /**
     * march
     * TODO select multiple (will need to pass all score events as array)
     */
    var allGlobjects = globjects.concat(retrogradeGlobjects);

    for (i = 0; i < 6; i++) {
        selected = [VS.getItem(allGlobjects)];
        score.push(selected);
    }

    return score;
})([]);
