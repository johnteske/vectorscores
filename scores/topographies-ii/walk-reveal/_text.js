var text = wrapper.append('text')
    .attr('class', 'instructions')
    .attr('text-anchor', 'middle')
    .attr('y', 220)
    .attr('opacity', 0)
    .text('explore the unknown, try to remember the past');

function toggleText(duration, toggle) {
    text.transition().duration(duration || transitionTime)
        .attr('opacity', toggle ? 1 : 0);
}

var makeTextToggler = function(toggle) {
    return function(duration) {
        toggleText(duration, toggle);
    };
};
