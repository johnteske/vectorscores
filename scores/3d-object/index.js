(function () {
  'use strict';

  function createScore() {
    var score = [
      // cube, for testing
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
      [1, 0, 1],
      // and a stray
      [-2, 0, 0]
    ];

    return score;
  }

  function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
      result[i] = [];
      for (var j = 0; j < m2.length; j++) {
        var sum = 0;
        for (var k = 0; k < m1[0].length; k++) {
          sum += m1[i][k] * m2[k][j];
        }
        if (!isNaN(sum)) {
          result[i][j] = sum;
        }
      }
    }
    return result;
  }

  function flatten(array) {
    return array.reduce(function(a, b) {
      return a.concat(b);
    }, []);
  }

  function makePoint(array) {
    return {
      x: array[0],
      y: array[1],
      z: array[2]
    };
  }

  function render(score) {
    // remove existing elements, if any
    score.container.selectAll(".rendered").remove();

    var c = makePoint([0, 0, 5]); // 3D point representing the camera
    var theta = makePoint([0, 0, 0]); // orientation of the camera (Tait–Bryan angles)

    // var c = makePoint([0, 0, -5]); // 3D point representing the camera
    // var theta = makePoint([Math.PI, 0, Math.PI]); // orientation of the camera (Tait–Bryan angles) NOTE x, y, z?

    var xMatrix = (function() {
      var cosOx = Math.cos(theta.x),
        sinOx = Math.sin(theta.x);
      return [[1, 0, 0], [0, cosOx, sinOx], [0, -sinOx, cosOx]];
    })();
    var yMatrix = (function() {
      var cosOy = Math.cos(theta.y),
        sinOy = Math.sin(theta.y);
      return [[cosOy, 0, -sinOy], [0, 1, 0], [sinOy, 0, cosOy]];
    })();
    var zMatrix = (function() {
      var cosOz = Math.cos(theta.z),
        sinOz = Math.sin(theta.z);
      return [[cosOz, sinOz, 0], [-sinOz, cosOz, 0], [0, 0, 1]];
    })();

    var cameraRotationMatrix = multiplyMatrices(
      multiplyMatrices(xMatrix, yMatrix),
      zMatrix
    );

    var rz = 100; // distance from the recording surface to the camera center

    for (var i = 0; i < score.obj.length; i++) {
      var a = makePoint(score.obj[i]); // the 3D point to be projected

      var aMinusCMatrix = [[a.x - c.x], [a.y - c.y], [a.z - c.z]];

      var d = multiplyMatrices(cameraRotationMatrix, aMinusCMatrix);
      d = makePoint(flatten(d));

      var b = {
        x: (d.x / d.z) * rz,
        y: (d.y / d.z) * rz
      };

      score.container
        .append("circle")
        .classed("rendered", 1)
        .attr("r", 1)
        .style("stroke", "none")
        .style("fill", "black")
        .attr("cx", b.x)
        .attr("cy", b.y);
    }

    score.container.attr("transform", "translate (150, 90)"); // TODO for testing
  }

  // generate (placeholder) score

  var score = {
    width: VS.getItem([3, 4, 5]),
    height: VS.getItem([3, 4, 5]),
    container: d3
      .select(".main")
      .attr("width", 640)
      .attr("height", 640)
      .append("g")
  };
  score.center = {
    x: score.width * 0.5 - 0.5,
    y: score.height * 0.5 - 0.5
  };
  score.radius = Math.sqrt(Math.pow(score.width, 2) + Math.pow(score.height, 2)); // distance of player from center of score
  score.obj = createScore();

  /**
   * setAngle accepts degrees, saves value as radians
   */
  function Performer() {
    var _angle,
      _position = {};

    return {
      setAngle: function(newAngle) {
        // substract 90 degress so origin is top, then convert to radians
        _angle = (newAngle - 90) * (Math.PI / 180);

        _position = {
          x: score.center.x + score.radius * Math.cos(_angle),
          y: score.center.y + score.radius * Math.sin(_angle)
        };

        return _angle;
      },
      getAngle: function() {
        return _angle;
      },
      getPosition: function() {
        return _position;
      },
      get: function() {
        return {
          x: _position.x,
          y: _position.y,
          angle: _angle
        };
      }
    };
  }

  var performer = new Performer();
  // TODO allow this to be set by query string on load,
  // also update query string so bookmarks/share/reloads retain current settings
  performer.setAngle(45);

  render(score);

}());
