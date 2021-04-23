module.exports = function (config) {
  // copy assets that are not built to the target dir
  config.addPassthroughCopy({
    "node_modules/d3/dist/d3.min.js": "assets/js/d3.min.js",
  });
  config.addPassthroughCopy("assets/modules");

  const scoreLayouts = ["score", "score-set", "movement"];
  scoreLayouts.forEach((template) =>
    config.addLayoutAlias(template, `layouts/${template}.11ty.js`)
  );

  config.setBrowserSyncConfig({
    codeSync: false,
    ghostMode: false,
  });
};
