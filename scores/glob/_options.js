VS.scoreOptions.add(
  "pitchClasses",
  { "pitch-classes": "numbers", prefer: "te" },
  new VS.PitchClassSettings()
);
VS.scoreOptions.add("transposition", 0, new VS.NumberSetting("transposition"));

export default (function () {
  var options = VS.scoreOptions.setFromQueryString();

  // TODO working with old property names in score, for now
  options.pitchClasses.display = options.pitchClasses["pitch-classes"];
  options.pitchClasses.preference = options.pitchClasses["prefer"];

  // TODO should coerce internally
  options.transposition = +options.transposition;

  return options;
})();
