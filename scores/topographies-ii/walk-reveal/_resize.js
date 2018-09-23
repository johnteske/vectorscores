function resize() {
    var main = d3.select('main');

    var w = parseInt(main.style('width'), 10);
    var h = parseInt(main.style('height'), 10);

    var scaleX = VS.clamp(w / layout.width, 0.25, 2);
    var scaleY = VS.clamp(h / layout.height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = w * 0.5;
    layout.margin.top = (h * 0.5) - ((layout.height * 0.25) * layout.scale);

    wrapper.attr('transform', 'translate(' + layout.margin.left + ',' + layout.margin.top + ') scale(' + layout.scale + ',' + layout.scale + ')');
}

d3.select(window).on('resize', resize);
d3.select(window).on('load', resize);
