function getScorePages(data) {
  return data.collections.all.filter((s) =>
    ["score", "score-set"].includes(s.data.layout)
  );
}

function getMovementsByUrl(url, data) {
  return data.collections.all.filter(
    (page) => page.data.layout === "movement" && page.url.includes(url)
  );
}

function pageToScore(p) {
  return {
    title: p.data.title,
    url: p.url,
    instrumentation: p.data.instrumentation,
    duration: p.data.duration,
    status: p.data.status,
  };
}

module.exports = {
  eleventyComputed: {
    scores: (data) => {
      return getScorePages(data).map((p) => ({
        ...pageToScore(p),
        movements: getMovementsByUrl(p.url, p.data).map(pageToScore),
      }));
    },
  },
};
