const fs = require("fs");
const test = require("tape");

test("build directories", function (t) {
  t.plan(2);

  fs.stat("_site", (err) => {
    t.ok(err == null, "target dir exists")
  });

  fs.stat("_site/scores", (err) => {
    t.error(err == null, "score dir does not exist in target")
  });
});
