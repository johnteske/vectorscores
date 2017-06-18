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
{% include_relative _score.js %}

// manual test score

VS.score.add(0, function() {
    addTrash(VS.getItem([3, 4]));
    updateTrash();
});

VS.score.add(2000, function() {
    trash.pop();
    trash.pop();
    updateTrash();
});

VS.score.add(4000, function() {
    addTrash(VS.getItem([1, 2]));
    updateTrash();
});

VS.score.add(6000, makeSpike);

VS.score.add(8000, function() {
    trash = [];
    updateTrash();
    hitSpike();
});

VS.score.add(10000, VS.noop);

VS.score.stopCallback = function() {
    trash = [];
    updateTrash();
};
