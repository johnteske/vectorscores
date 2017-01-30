function createScoreFragment(rows,cols){
    var _array = [];
    for(var i = 0; i < rows; i++){ // row
        _array[i] = [];
        for(var j = 0; j < cols; j++){ // col
            _array[i][j] = VS.getWeightedItem([0,1,2],[0.55,0.05,0.4]);
        }
    }
    return _array;
}
