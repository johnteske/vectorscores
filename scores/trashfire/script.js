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

    return tf;
})();

{% include_relative _dumpster.js %}
{% include_relative _trash.js %}
{% include_relative _spike.js %}
{%comment%}{% include_relative _score.js %}{%endcomment%}


// manual test score

VS.score.add(0, function() {
    trash = [1, 2, 3, 4].map(function() {
        return {
            size: VS.getRandExcl(25, 75),
            active: true,
            type: VS.getItem(["circle", "rect"])
        };
    });
    updateTrash();
});

VS.score.add(2000, function() {
    trash.pop();
    trash.pop();
    updateTrash();
});

VS.score.add(4000, function() {
    var newTrash = { active: true, size: VS.getRandExcl(25, 75), type: "rect" };
    trash.push(newTrash);
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
// VS.score.add(10000, spike.appear);
// VS.score.add(14000, spike.hit);
