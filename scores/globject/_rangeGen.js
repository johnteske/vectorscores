export function rangeGen(length, min, max) {
  var pcs = [];
  for (var i = 0; i < length; i++) {
    pcs.push(Math.floor(Math.random() * (max - min)) + min);
  }
  return pcs;
}

export function wedgeRangeGen(length, min, max) {
  var pcs = [],
    band = (max - min) / length;
  for (var i = 0; i < length; i++) {
    pcs.push(Math.floor(Math.random() * band) + (min + band * i));
  }
  return pcs;
}

export function stepRangeGen(length, min, max) {
  var pcs = [],
    thispc,
    lmax,
    lmin,
    disp = 10;
  min += disp;
  max -= disp;
  thispc = Math.floor(Math.random() * (max - min)) + min; // initial selection
  for (var i = 0; i < length; i++) {
    lmax = Math.min(thispc + disp, max);
    lmin = Math.max(thispc - disp, min);
    thispc = Math.floor(Math.random() * (lmax - lmin)) + lmin;
    pcs.push(thispc);
  }
  return pcs;
}
