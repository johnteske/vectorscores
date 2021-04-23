const path = require("path");
const { loadDomThenTest } = require(path.resolve(".", "bin/js/tape-setup"));

const htmlPath = "_site/scores/tutorial/index.html";

loadDomThenTest("VS#createHooks", htmlPath, (t, window) => {
  const { VS } = window;

  const hooks = new VS.createHooks(["play"]);

  const expected = {
    a: 2,
    b: 4,
    c: 6,
  };
  let actual = {};

  hooks.add("play", () => {
    actual.a = 2;
  });
  hooks.add("play", () => {
    actual.b = 4;
  });
  hooks.add("play", () => {
    actual.c = 6;
  });

  hooks.trigger("play");

  t.deepEqual(actual, expected, "should execute all registered functions");

  t.throws(() => {
    hooks.add("test", () => {});
  }, "should throw an error when adding an unregistered hook");

  t.end();
});
