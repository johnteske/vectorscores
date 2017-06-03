function createScoreFragment(rows, cols){
    var _array = [];
    for(var row = 0; row < rows; row++){
        _array[row] = [];
        for(var col = 0; col < cols; col++){
            _array[row][col] = VS.getWeightedItem([0, 1, 2], [0.55, 0.05, 0.4]);
        }
    }
    return _array;
}
