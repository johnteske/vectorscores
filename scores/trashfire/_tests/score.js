const path = require("path");
const { loadDomThenTest } = require(path.resolve(".", "bin/js/tape-setup"));

loadDomThenTest(
  "trashfire",
  "_site/scores/trashfire/index.html",
  (t, window) => {
    const eventTimesAreIntegers = window.score.every(
      bar => bar.time === Math.floor(bar.time)
    );
    t.true(eventTimesAreIntegers, "should have score event times as integers");

    t.end();
  }
);
