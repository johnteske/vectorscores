const path = require("path");
const { loadDomThenTest } = require(path.resolve(".", "bin/js/tape-setup"));

const htmlPath = "_site/scores/tutorial/index.html";
const sampleSize = 1; // 5000000

const reportDistribution = function ({ expected, actual }) {
  console.log("sample size:\t", sampleSize);
  console.log("expected:\t", expected);
  console.log("actual:\t", actual);
};

loadDomThenTest(
  "VS#getRandExcl",
  { skip: sampleSize < 999 },
  htmlPath,
  (t, window) => {
    const { VS } = window;

    const min = 0;
    const max = 1;
    let results = [];

    for (let i = 0; i < sampleSize; i++) {
      results.push(VS.getRandExcl(min, max));
    }

    const outOfRange = results.filter((v) => {
      return v < min && v <= max;
    });

    t.equal(
      outOfRange.length,
      0,
      `contain only values between min (inclusive) and max (exclusive) in sample size of ${sampleSize}`
    );

    t.end();
  }
);

loadDomThenTest(
  "VS#getRandIntIncl",
  { skip: sampleSize < 999 },
  htmlPath,
  (t, window) => {
    const { VS } = window;

    const min = 1;
    const max = 5;
    let results = [];

    for (let i = 0; i < sampleSize; i++) {
      results.push(VS.getRandIntIncl(min, max));
    }

    const outOfRange = results.filter((v) => {
      return v < min && v < max;
    });
    t.equal(
      outOfRange.length,
      0,
      `contain only values between min (inclusive) and max (inclusive) in sample size of ${sampleSize}`
    );

    const roundedResults = results.filter((v) => {
      return Math.round(v) !== v;
    });
    t.equal(
      roundedResults.length,
      0,
      `contain only integers in sample size of ${sampleSize}`
    );

    t.end();
  }
);

loadDomThenTest(
  "VS#getItem",
  { skip: sampleSize < 999 },
  htmlPath,
  (t, window) => {
    const { VS } = window;

    const items = ["a", "b", "c", "d", "e"];
    const count = [0, 0, 0, 0, 0];
    let results = [];

    for (let i = 0; i < sampleSize; i++) {
      results.push(VS.getItem(items));
    }

    const isAnItem = results.filter((v) => {
      return items.indexOf(v) !== -1;
    });

    t.equal(isAnItem.length, results.length, "return only items in list");

    t.test("VS#getItem distribution", (t2) => {
      let weighting = results
        .reduce((acc, val) => {
          acc[items.indexOf(val)]++;
          return acc;
        }, count)
        .map((v) => {
          return v / sampleSize;
        });

      const probability = 1 / items.length;

      reportDistribution({
        expected: count.map(() => probability),
        actual: weighting,
      });

      t2.end();
    });

    t.end();
  }
);

loadDomThenTest(
  "VS#getWeightedItem",
  { skip: sampleSize < 999 },
  htmlPath,
  (t, window) => {
    const { VS } = window;

    const items = ["a", "b", "c", "d", "e"];
    const weights = [0.5, 0.25, 0.125, 0.0625, 0.0625];
    const count = [0, 0, 0, 0, 0];
    let results = [];

    for (let i = 0; i < sampleSize; i++) {
      results.push(VS.getWeightedItem(items, weights));
    }

    const isAnItem = results.filter((v) => {
      return items.indexOf(v) !== -1;
    });

    t.equal(isAnItem.length, results.length, "return only items in list");

    t.test("VS#getWeightedItem distribution", (t2) => {
      let weighting = results
        .reduce((acc, val) => {
          acc[items.indexOf(val)]++;
          return acc;
        }, count)
        .map((v) => {
          return v / sampleSize;
        });

      reportDistribution({
        expected: weights,
        actual: weighting,
      });

      t2.end();
    });

    t.end();
  }
);

loadDomThenTest("VS#clamp", htmlPath, (t, window) => {
  const { VS } = window;

  t.equal(VS.clamp(11, 0, 5), 5, "return max when value is greater than max");
  t.equal(VS.clamp(-11, 0, 5), 0, "return min when value is less than min");
  t.equal(
    VS.clamp(2.5, 0, 5),
    2.5,
    "return value when value is between min and max"
  );

  t.end();
});

loadDomThenTest("VS#normalize", htmlPath, (t, window) => {
  const { VS } = window;

  const min = -5;
  const max = 5;

  t.equal(VS.normalize(5, min, max), 1, "return 1 when value is max");
  t.equal(
    VS.normalize(0, min, max),
    0.5,
    "return 0.5 when value is midpoint between min and max"
  );
  t.equal(VS.normalize(-5, min, max), 0, "return 0 when value is min");

  t.end();
});

loadDomThenTest("VS#mod", htmlPath, (t, window) => {
  const { VS } = window;

  t.equal(VS.mod(6, 12), 6, "return 6 when 6 mod 12");
  t.equal(VS.mod(13, 12), 1, "return 1 when 13 mod 12");

  t.end();
});
