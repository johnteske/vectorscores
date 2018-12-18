module.exports = function(eleventyConfig) {
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true
  });

  eleventyConfig.addPassthroughCopy("assets");

  // Aliases are in relation to the _includes folder
  eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.html');
  eleventyConfig.addLayoutAlias('compress', 'layouts/compress.html');
  eleventyConfig.addLayoutAlias('compress-js', 'layouts/compress-js.html');
  
  eleventyConfig.addLayoutAlias('score', 'layouts/score.html');
  eleventyConfig.addLayoutAlias('score-set', 'layouts/score-set.html');
  eleventyConfig.addLayoutAlias('movement', 'layouts/movement.html');

  return {
    dir: {
      input: "./",
      output: "./_site"
    }
  };
}
