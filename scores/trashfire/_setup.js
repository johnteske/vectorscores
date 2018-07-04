var TrashFire = (function() {
    var tf = {};

    tf.view = {
        width: 480,
        height: 480
    };

    tf.svg = d3.select('.main')
        .attr('width', tf.view.width)
        .attr('height', tf.view.height);

    tf.wrapper = tf.svg.append('g');

    tf.dumpster = {
        y: 200
    };

    return tf;
})();

var layout = {
    width: TrashFire.view.width,
    height: TrashFire.view.height,
    margin: {},
    main: d3.select('main')
};
