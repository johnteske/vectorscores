const movementsFromUrl = (url, data) =>
  data.collections.all.filter(
    (page) => page.data.layout === "movement" && page.url.includes(url)
  );

module.exports = {
  movementsFromUrl,
};
