function createScoreFragment(rows, cols) {
    var _array = [];
    for (var row = 0; row < rows; row++) {
        _array[row] = [];
        for (var col = 0; col < cols; col++) {
            var height = values[col + row * width];
            _array[row][col] = {
                height: height,
                heightIndex: height > 0 ? Math.floor(height) : Math.ceil(height)
            };
        }
    }
    return _array;
}
