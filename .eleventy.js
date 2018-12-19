module.exports = function(config) {
  config.setLiquidOptions({
    dynamicPartials: true
  });

  config.markdownTemplateEngine = "njk";

  config.addPassthroughCopy("assets");

  // Aliases are in relation to the _includes folder
  config.addLayoutAlias('default', 'layouts/default.html');
  config.addLayoutAlias('page', 'layouts/page.html');
  config.addLayoutAlias('compress', 'layouts/compress.html');
  config.addLayoutAlias('compress-js', 'layouts/compress-js.html');
  
  config.addLayoutAlias('score', 'layouts/score.html');
  config.addLayoutAlias('score-set', 'layouts/score-set.html');
  config.addLayoutAlias('movement', 'layouts/movement.html');

  return {
    dir: {
      input: "./",
      output: "./_site"
    }
  };
}
