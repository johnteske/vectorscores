(function () {
  'use strict';

  const main = d3.select(".main");
  const wrapper = main.append("g");

  //drone(wrapper);

  const w = parseInt(main.style("width"), 10);
  const h = parseInt(main.style("height"), 10);

  function phrase() {
    var notes = [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }];

    function addNote() {
      var dir = VS.getItem([-1, 1, -2, 2, -3, 3]);
      dir = dir * 2;
      notes.push({ pitch: 2 * dir, duration: 1 });
      notes.push({ pitch: 2 * dir, duration: 0 });
    }

    for (var i = 0; i < 8; i++) {
      addNote();
    }

    return notes;
  }

  var lineCloud = VS.lineCloud()
    .duration(10)
    .phrase(phrase())
    .curve(d3.curveLinear)
    .width(w * 0.8)
    .height(h * 0.5);

  wrapper
    .call(lineCloud, { n: 2 })
    .attr("fill", "none")
    .attr("stroke", "black");

  // line-cloud has issues, not to be solved now
  d3.select(".line-cloud-path").remove();

}());
