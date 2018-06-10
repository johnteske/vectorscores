/**
 * Score pointer/cue aid
 */
var cueIndicator = (function() {
    var cueIndicator = {};

    // TODO will this be needed in the score info?
    function makeCueTriangle(selection) {
        selection.attr('class', 'indicator')
            .attr('d', 'M-6.928,0 L0,2 6.928,0 0,12 Z')
            .style('stroke', 'black')
            .style('stroke-width', '1')
            .style('fill', 'black')
            .style('fill-opacity', '0');
    }

    var cueTriangle;
    var blink;

    cueIndicator.initAndRender = function() {
        cueTriangle = container.append('path')
            .call(makeCueTriangle);

        // this.positionToCenter();

        blink = VS.cueBlink(cueTriangle)
            .beats(3)
            .on(function(selection) {
                selection.style('fill-opacity', 1);
            })
            .off(function(selection) {
                selection.style('fill-opacity', 0);
            })
            .end(function(selection) {
                selection.style('fill-opacity', 0);
            });
    };

    cueIndicator.positionToCenter = function() {
        cueTriangle.attr('transform', 'translate(' + viewCenter + ',' + layout.cueIndicator.y + ')');
    };

    cueIndicator.blink = function() {
        blink.start();
    };

    cueIndicator.cancel = function() {
        blink.cancel();
    };

    return cueIndicator;
}());

VS.score.preroll = 3000;

function prerollAnimateCue() {
    VS.score.schedule(VS.score.preroll - 3000, cueIndicator.blink);
}
