var morph = require("mock-env").morph;
var test = require("tape");

var settings = require("./websockets.11ty.js");

test("timing test", function (t) {
  var withWebsockets = morph(
    function () {
      return settings();
    },
    {
      WEBSOCKETS: "arbitrary",
    }
  );

  t.equal(withWebsockets.includes("ws-log"), true);

  var withoutWebsockets = morph(
    function () {
      return settings();
    },
    {},
    ["WEBSOCKETS"]
  );

  t.equal(withoutWebsockets.includes("ws-log"), false);

  t.end();
});
