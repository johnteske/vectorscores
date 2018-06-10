// TODO this could be split into smaller functions
// TODO this flow could be written to avoid manipulating the data with the selections
function calculateJoiningSymbolPoints(selection, width, data, joinFilter) {
    // Save rendered dimensions
    selection.each(function(d) {
        d.BBox = d3.select(this).node().getBBox();
    });

    data.forEach(function(current, index, array) {
        if (!joinFilter(current)) {
            return;
        }

        var previous = array[index - 1];
        var next = array[index + 1];

        if ((index - 1) > -1) {
            current.x1 = previous.BBox.x + previous.BBox.width;
        } else {
            current.x1 = 0;
        }

        if (index + 1 < array.length) {
            current.x2 = next.BBox.x;
        } else {
            current.x2 = width;
        }
    });
}
