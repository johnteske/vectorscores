function createScore(cols, rows) {
    var _score = [];
    for (var row = 0; row < rows; row++) {
        _score.push([]); // add a row
        for (var col = 0; col < cols; col++) {
            _score[row][col] = VS.getItem([0, 1]);
        }
    }
    return _score;
}
