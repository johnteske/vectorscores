module.exports = function(config) {
  config.addPassthroughCopy("assets/svg");

  // Aliases are in relation to the _includes folder
  const pages = ["default", "page", "works"];
  pages.forEach(template =>
    config.addLayoutAlias(template, `layouts/${template}.11ty.js`)
  );

  // config.addLayoutAlias('score', 'layouts/score.html');
  // config.addLayoutAlias('score-set', 'layouts/score-set.html');
  // config.addLayoutAlias('movement', 'layouts/movement.html');

  return {
    dir: {
      input: "./",
      output: "./_site"
    }
  };
};
