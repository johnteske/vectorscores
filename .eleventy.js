module.exports = function(config) {
  config.addPassthroughCopy("assets/svg");

  // Aliases are in relation to the _includes folder
  const pageLayouts = ["default", "page"];
  pageLayouts.forEach(template =>
    config.addLayoutAlias(template, `layouts/page/${template}.11ty.js`)
  );

  const scoreLayouts = ["score"];
  scoreLayouts.forEach(template =>
    config.addLayoutAlias(template, `layouts/score/${template}.11ty.js`)
  );

  // config.addLayoutAlias('score-set', 'layouts/score-set.html');
  // config.addLayoutAlias('movement', 'layouts/movement.html');

  return {
    dir: {
      input: "./",
      output: "./_site"
    }
  };
};
