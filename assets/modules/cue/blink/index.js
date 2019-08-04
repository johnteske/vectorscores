/**
 * Cue events--[on,off] loop based on number of beats:
 * inactive,[on,off],down,off,inactive
 *
 * TODO set interval by tempo
 * TODO re-consider duration method's usefulness or rename totalDuration to avoid confusion with setting on/off durations
 */
VS.cueBlink = function(cueSelection) {
  var beats = 3;
  var interval = 1000; // period, T
  var onDuration = 0;
  var offDuration = 500;

  var noop = function() {};

  var setInactive = noop;
  var setOn = noop;
  var setOff = noop;
  var setDown = noop;

  function blink(delay, isLast) {
    cueSelection
      .transition()
      .delay(delay)
      .duration(onDuration)
      .call(isLast ? setDown : setOn)
      .transition()
      .delay(onDuration)
      .duration(offDuration)
      .call(isLast ? setInactive : setOff);
  }

  function cueBlink() {}

  cueBlink.duration = function() {
    return beats * interval;
  };

  cueBlink.start = function() {
    for (var i = 0; i < beats + 1; i++) {
      blink(i * interval, i === beats);
    }
  };

  cueBlink.cancel = function() {
    cueSelection.interrupt().call(setInactive);
  };

  cueBlink.beats = function(_) {
    return arguments.length ? ((beats = +_), cueBlink) : beats;
  };

  cueBlink.onDuration = function(_) {
    return arguments.length ? ((onDuration = +_), cueBlink) : onDuration;
  };

  cueBlink.offDuration = function(_) {
    return arguments.length ? ((offDuration = +_), cueBlink) : offDuration;
  };

  cueBlink.interval = function(_) {
    return arguments.length ? ((interval = +_), cueBlink) : interval;
  };

  cueBlink.on = function(_) {
    return arguments.length && typeof _ === "function"
      ? ((setOn = _), cueBlink)
      : setOn;
  };

  cueBlink.off = function(_) {
    return arguments.length && typeof _ === "function"
      ? ((setOff = _), cueBlink)
      : setOff;
  };

  cueBlink.down = function(_) {
    return arguments.length && typeof _ === "function"
      ? ((setDown = _), cueBlink)
      : setDown;
  };

  cueBlink.inactive = function(_) {
    if (arguments.length && typeof _ === "function") {
      setInactive = _;

      cueSelection.call(setInactive);

      return cueBlink;
    } else {
      return setInactive;
    }
  };

  return cueBlink;
};
