---
---

var TrashFire = (function() {
    var tf = {};

    tf.view = {
        width: 480,
        height: 480
    };

    tf.svg = d3.select(".main")
        .attr("width", tf.view.width)
        .attr("height", tf.view.height);

    tf.dumpster = {
        y: 200
    };

    return tf;
})();

{% include_relative _dumpster.js %}
{% include_relative _trash.js %}
{% include_relative _spike.js %}
{% include_relative _noise.js %}
{% include_relative _score.js %}

/**
 * Trash
 * One cycle per 10 s interval, always at start
 */
VS.score.add(0, function() {
    addTrash(VS.getItem([3, 4]));
});
for (var i = 0; i < 6; i++) {
    var time = (i * 10000) + (Math.random() * 5000);
    VS.score.add(time, function() {
        addTrash(VS.getItem([1, 2, 3, 4]));
    });
    VS.score.add(time + (Math.random() * 5000), function() {
        removeTrash(VS.getItem([1, 2]));
    });
}

/**
 * Spikes
 * One cycle per 20 s interval,
 */
for (var i = 0; i < 3; i++) {
    var time = (i * 20000) + (Math.random() * 20000);
    VS.score.add(time, function() {
        makeSpike();
    });
    VS.score.add(time + 2000, function() {
        hitSpike();
    });
}

/**
 * Noise
 * One cycle per 30 s interval,
 */
for (var i = 0; i < 2; i++) {
    var time = (i * 30000) + (Math.random() * 30000);
    VS.score.add(time, function() {
        addNoise(200);
    });
    VS.score.add(time + 2000, function() {
        removeNoise();
    });
}

/**
 * Sort score by event time
 */
VS.score.events.sort(function (a, b) {
  return a[0] - b[0];
});

VS.score.stopCallback = function() {
    trash = [];
    updateTrash();
    TrashFire.noiseLayer.selectAll(".noise").remove();
};
