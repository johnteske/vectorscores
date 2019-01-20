const handleUndefined = input => input || "";
const catMap = (f, a) => a.map(f).join("");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const upcoming = data =>
  data.performances.upcoming ? `<h2>Upcoming</h2>` : "";

const past = data =>
  data.performances.past ? `<h2>Past</h2>${performanceList("past", data)}` : "";

const dateFormat = yyyymmdd => {
  const [yyyy, mm, dd] = yyyymmdd.split("-").map(Number);
  return `${monthNames[mm - 1]} ${dd}, ${yyyy}`;
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

const performanceList = (category, data) => {
  const performances = data.performances[category];
  const workLink = title => {
    const url = getWorkUrl(data, title);
    return url ? `<a href="${url}" class="work-title">${title}/a>` : title;
  };
  const renderPerformance = perf => {
    return `
<h4 class="perf-date">
  <a href="${perf.url}">${dateFormat(perf.dateStart)}</a>
</h4>
<h3>${perf.title}</h3>
  ${handleUndefined(perf.works && catMap(workLink, perf.works))}
`;
  };

  return catMap(renderPerformance, performances);
};

// <p>
// {% for work in perf.works %}
// {% for pg in site.pages %}
// {% if pg.title == work %}
// <a href="{{ pg.url | relative_url }}" class="work-title">{{ work }}</a>
// {% endif %}
// {% endfor %}
// {% endfor %}
// </p>

// <p>{{ perf.address }}</p>
// <p>{{ perf.time }}{% if perf.price %}, {{ perf.price }}{% endif %}</p>
// {% endfor %}

module.exports = class {
  data() {
    return {
      templateEngineOverride: "11ty.js,md",
      title: "Performances",
      layout: "page",
      permalink: "/performances/",
      tags: ["topNav"]
    };
  }

  render(data) {
    return upcoming(data) + past(data);
  }
};
