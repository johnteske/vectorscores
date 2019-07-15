module.exports = function(config) {
  config.addPassthroughCopy("assets/js/lib/d3.v4.min.js");
  config.addPassthroughCopy("assets/modules");
  config.addPassthroughCopy("assets/svg");

  config.addPassthroughCopy("scores/trashfire/dumpster.svg");

  // Aliases are in relation to the _includes folder
  const pageLayouts = ["default", "page"];
  pageLayouts.forEach(template =>
    config.addLayoutAlias(template, `layouts/page/${template}.11ty.js`)
  );

  const scoreLayouts = ["score", "score-set", "movement"];
  scoreLayouts.forEach(template =>
    config.addLayoutAlias(template, `layouts/score/${template}.11ty.js`)
  );

  return {
    dir: {
      input: "./",
      output: "./_site"
    }
  };
};
