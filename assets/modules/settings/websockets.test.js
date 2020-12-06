var morph = require("mock-env").morph;
var test = require("tape");

var settings = require("./websockets.11ty.js");

test("settings component with WEBSOCKETS flag", function (t) {
  var withWebsockets = morph(settings, {
    WEBSOCKETS: "arbitrary",
  });
  t.equal(withWebsockets.includes("ws-log"), true, "with flag");

  var withoutWebsockets = morph(settings, {}, ["WEBSOCKETS"]);
  t.equal(withoutWebsockets.includes("ws-log"), false, "without flag");

  t.end();
});
