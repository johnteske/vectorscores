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
{%comment%}{% include_relative _bins.js %}{%endcomment%}
{%comment%}{% include_relative _spike.js %}{%endcomment%}
{%comment%}{% include_relative _score.js %}{%endcomment%}

// var crumple = TrashFire.Trash(60, 60);
// crumple.makeCircle();
//
// var crumple2 = TrashFire.Trash(60, 60); // TODO allow diff sizes
// crumple2.makeCircle();
//
// var crumple3 = TrashFire.Trash(60, 60);
// crumple3.makeCircle();
//
// var spike = TrashFire.Spike();

// manual test score

VS.score.add(0, function() {
    trash = [1, 2, 3, 4].map(function() {
        return {
            size: VS.getRandExcl(25, 75),
            active: true
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
    var newTrash = { active: true, size: VS.getRandExcl(25, 75) };
    trash.push(newTrash);
    updateTrash();
});

VS.score.add(6000, VS.noop);

VS.score.stopCallback = function() {
    trash = [];
    updateTrash();
};
// VS.score.add(10000, spike.appear);
// VS.score.add(14000, spike.hit);
