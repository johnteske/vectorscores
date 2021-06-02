import _test from "tape";

const Page = require("../index.11ty.js");
const page = new Page();

import { fromDisp } from "./themes";

function test(title: string, fn: _test.TestCase) {
  _test(`${page.data().title} - ${title}`, fn);
}

test("disparity bounds", function (t) {
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

  t.end();
});

test("disparity accuracy", function (t) {
  const items = Array.from({ length: 100 }, (x, i) => i);

  [0, 0.25, 0.5, 1].forEach((disparity) => {
    const [min, max] = fromDisp(items, disparity);
    const expectedRange = Math.round(disparity * 100);
    t.equal(max - min, expectedRange, `${disparity} disparity`);
  });

  t.end();
});
