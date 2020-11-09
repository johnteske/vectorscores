module.exports = function(config) {
  config.addPassthroughCopy("assets/js/lib/d3.v4.min.js");
  config.addPassthroughCopy("assets/modules");

  config.addPassthroughCopy("scores/trashfire/dumpster.svg");

  const scoreLayouts = ["score", "score-set", "movement"];
  scoreLayouts.forEach(template =>
    config.addLayoutAlias(template, `layouts/${template}.11ty.js`)
  );

  config.setBrowserSyncConfig({
    codeSync: false,
    ghostMode: false
  });
};
