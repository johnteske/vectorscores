// TODO

module.exports = data =>
  data.collections.score
    ? `${data.collections.score.map(d => d.page.url)}`
    : "";
