/**
 * Assign properties to row-major order data
 */
function createScoreFragment(data, width, nRows, nCols) {
    for (var i = 0; i < data.length; i++) {
        var h = data[i];

        data[i] = {
            height: h,
            heightIndex: ~~h // h > 0 ? Math.floor(h) : Math.ceil(h)
        }
    }

    return rowMajorOrderToGrid(data, width, nRows, nCols);
}

/**
 * Convert row-major order data in two-dimensional array
 * and assign heightIndex for symbol matching
 */
function rowMajorOrderToGrid(data, width, nRows, nCols) {
    var grid = [];

    for (var row = 0; row < nRows; row++) {
        grid[row] = [];

        for (var col = 0; col < nCols; col++) {
            grid[row][col] = data[col + row * width];
        }
    }

    return grid;
}
