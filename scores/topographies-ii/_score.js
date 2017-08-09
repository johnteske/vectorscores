/**
 * Convert row-major order data in two-dimensional array
 * and assign heightIndex for symbol matching
 */
function createScoreFragment(data, width, nRows, nCols) {
    var grid = [];

    for (var row = 0; row < nRows; row++) {
        grid[row] = [];

        for (var col = 0; col < nCols; col++) {
            var height = data[col + row * width];

            grid[row][col] = {
                height: height,
                heightIndex: ~~height // height > 0 ? Math.floor(height) : Math.ceil(height)
            };
        }
    }

    return grid;
}
