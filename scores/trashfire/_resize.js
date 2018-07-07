/**
 * Resize
 */
function resize() {
    var main = layout.main;

    var w = layout.main.width = parseInt(main.style('width'), 10);
    var h = layout.main.height = parseInt(main.style('height'), 10);

    var scaleX = VS.clamp(w / layout.width, 0.25, 2);
    var scaleY = VS.clamp(h / layout.height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = (w * 0.5) - ((layout.width * 0.5) * layout.scale);
    layout.margin.top = (h * 0.5) - ((layout.height * 0.5) * layout.scale);

    TrashFire.wrapper.attr('transform', 'translate(' + layout.margin.left + ',' + layout.margin.top + ') scale(' + layout.scale + ',' + layout.scale + ')');
}

d3.select(window).on('resize', resize);
