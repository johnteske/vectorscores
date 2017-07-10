function createScoreFragment(rows, cols) {
    var _array = [];
    for (var row = 0; row < rows; row++) {
        _array[row] = [];
        for (var col = 0; col < cols; col++) {
            _array[row][col] = values[col + row * width];
        }
    }
    return _array;
}
