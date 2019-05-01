VS.lineCloud = function() {
  var w = VS.constant(127),
    h = VS.constant(127),
    dur = VS.constant(1),
    phrase = VS.constant([
      { pitch: 0, duration: 1 },
      { pitch: 0, duration: 0 }
    ]),
    phrases = VS.constant(5),
    transposition = VS.constant("random"),
    curve = d3.curveLinear;

  // TODO how to handle last duration?
  // if last dur !== 0, duplicate pitch with 0 dur

  function randomY() {
    return Math.floor(VS.getRandExcl(0, 128));
  }
  function octaveY() {
    return 10 * Math.floor(VS.getRandExcl(0, 12));
  }

  // NOTE x is currently used to ensure x values are evenly distributed in card
  function phraseToPoints(points, x, transposeFn) {
    var phraseDuration = points.reduce(function(sum, o) {
      return sum + o.duration;
    }, 0);

    var durationScale = phraseDuration / dur();

    var currentTime = 0;

    var xOffset = x * (1 - durationScale); // VS.getRandExcl(0, 1 - durationScale);
    var yOffset = transposeFn();

    return points.map(function(o) {
      var point = {
        x: currentTime + xOffset,
        y: o.pitch + yOffset
      };

      currentTime += (o.duration / phraseDuration) * durationScale;

      return point;
    });
  }

  function midiToY(y) {
    return 1 - y / 127;
  }

  function lineCloud(selection, args) {
    args = args || {};

    // TODO deprecate args.n
    var n = args.n || phrases();

    var width = w(), // w(d, i),
      height = h(); // h(d, i);
    // duration = dur(); // TODO

    var data = [];

    var transposeFn = transposition() === "octave" ? octaveY : randomY;

    for (var i = 0; i < n; i++) {
      // NOTE x is currently used to ensure x values are evenly distributed in card
      data.push(phraseToPoints(phrase(), i / (n - 1), transposeFn));
    }

    var line = d3
      .line()
      .x(function(d) {
        return d.x * width;
      })
      .y(function(d) {
        return midiToY(d.y) * height;
      })
      .curve(curve);

    selection
      .selectAll(".line-cloud-path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "line-cloud-path")
      .attr("d", line);
  }

  lineCloud.width = function(_) {
    return arguments.length
      ? ((w = typeof _ === "function" ? _ : VS.constant(+_)), lineCloud)
      : w;
  };

  lineCloud.height = function(_) {
    return arguments.length
      ? ((h = typeof _ === "function" ? _ : VS.constant(+_)), lineCloud)
      : h;
  };

  lineCloud.duration = function(_) {
    return arguments.length
      ? ((dur = typeof _ === "function" ? _ : VS.constant(+_)), lineCloud)
      : dur;
  };

  lineCloud.phrase = function(_) {
    return arguments.length
      ? ((phrase = typeof _ === "function" ? _ : VS.constant(_)), lineCloud)
      : phrase;
  };

  lineCloud.phrases = function(_) {
    return arguments.length
      ? ((phrases = typeof _ === "function" ? _ : VS.constant(_)), lineCloud)
      : phrases;
  };

  lineCloud.transposition = function(_) {
    return arguments.length
      ? ((transposition = typeof _ === "function" ? _ : VS.constant(_)),
        lineCloud)
      : transposition;
  };

  lineCloud.curve = function(_) {
    return arguments.length
      ? ((curve = typeof _ === "function" ? _ : curve), lineCloud)
      : curve;
  };

  return lineCloud;
};
