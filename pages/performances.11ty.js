const { catMap, maybe } = require("eleventy-lib");

const dateFormat = (yyyymmdd) => {
  return yyyymmdd;
};

const getWorkUrl = (data, title) => {
  // TODO also set, movement, etc.
  const scores = data.collections.score;
  if (!scores) {
    return;
  }
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].title === title) {
      return scores[i].url;
    }
  }
};

const performanceList = (data) => {
  const performances = data.performances.reverse().filter((p) =>
    p.tags != null && p.tags.includes("vectorscores")
  );
  const workLink = (title) => {
    const url = getWorkUrl(data, title);
    return url ? `<a href="${url}" class="work-title">${title}/a>` : title;
  };
  const details = (perf) => {
    return `
<p>${perf.address}</p>
<p>${perf.time}${perf.price ? ", " + perf.price : ""}</p>
`;
  };

  const renderPerformance = (perf) => {
    return `
<h4 class="perf-date">
  <a href="${perf.url}">${dateFormat(perf.date)}</a>
</h4>
<h3>${perf.title}</h3>
  ${maybe(perf.works && catMap(workLink, perf.works))}
${details(perf)}
`;
  };

  return catMap(renderPerformance, performances);
};

module.exports = class {
  data() {
    return {
      title: "Performances",
      layout: "page",
      permalink: "/performances/",
      tags: ["topNav"],
    };
  }

  render(data) {
    return performanceList(data);
  }
};
