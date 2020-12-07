const { catMap, url } = require("eleventy-lib");

const forEachModuleWithFile = (basename, render, data) => {
  const modules = data.modules || [];
  const filtered = process.env.WEBSOCKETS
    ? modules
    : modules.filter((m) => m !== "websockets");
  return filtered.length
    ? catMap((m) => {
        const path = `/modules/${m}/${basename}`;
        return render(url.asset(data.site.baseUrl, path));
      }, filtered)
    : "";
};

const movementsFromUrl = (url, data) =>
  data.collections.all.filter(
    (page) => page.data.layout === "movement" && page.url.includes(url)
  );

module.exports = {
  forEachModuleWithFile,
  movementsFromUrl,
};
