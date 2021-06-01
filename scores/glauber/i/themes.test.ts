import test from "tape";

import { fromDisp } from "./themes";

const cont = Array.from({ length: 100 }, (x, i) => i);

test(__dirname + " disparity", function (t) {
  // given an array of 100 integers and 0.25 disparity,
  // expect the min/max to be 25 apart
  const [min0, max0] = fromDisp(cont, 0.25);
  t.equal(max0 - min0, 25, "disparity accuracy");

  t.throws(
    () => {
      fromDisp([0, 1, 2], 1.1);
    },
    /must be between/,
    "throws on disparity > 1"
  );
  t.throws(
    () => {
      fromDisp([0, 1, 2], -12);
    },
    /must be between/,
    "throws on disparity < 0"
  );

  const [min1, max1] = fromDisp([0, 1, 2], 0);
  t.ok(min1 === max1, "no disparity");

  // TODO test sample size to see if both occur (but low sample size)
  const [min, max] = fromDisp([0, 1, 2], 0.5);
  t.ok((min === 0 && max === 1) || (min === 1 && max === 2));

  t.deepEquals(fromDisp([0, 1, 2], 1), [0, 2], "max disparity");

  t.end();
});
