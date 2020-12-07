module.exports = function(config) {
  // copy assets that are not built to the target dir
  config.addPassthroughCopy("assets/js/lib/d3.v4.min.js");
  config.addPassthroughCopy("assets/modules");

  const scoreLayouts = ["score", "score-set", "movement"];
  scoreLayouts.forEach(template =>
    config.addLayoutAlias(template, `layouts/${template}.11ty.js`)
  );

  config.setBrowserSyncConfig({
    codeSync: false,
    ghostMode: false
  });
};
