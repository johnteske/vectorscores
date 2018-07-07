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
        y: 200,
        width: 312,
        height: 204
    };

    tf.trashOrigin = {
        x: tf.dumpster.width * 0.5,
        y: tf.dumpster.height * 0.5
    };

    return tf;
})();

var layout = {
    width: TrashFire.view.width,
    height: TrashFire.view.height,
    margin: {},
    main: d3.select('main')
};
