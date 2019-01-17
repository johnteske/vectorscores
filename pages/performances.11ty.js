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
  data.performances.past
    ? `<h2>Past</h2>${data.performances.past.map(performance).join("")}`
    : "";

const dateFormat = yyyymmdd => {
  const [yyyy, mm, dd] = yyyymmdd.split("-").map(Number);
  return `${monthNames[mm - 1]} ${dd}, ${yyyy}`;
};

const performance = perf => {
  return `<h4 class="perf-date"><a href="${perf.url}">${dateFormat(
    perf.dateStart
  )}</a></h4><h3>${perf.title}</h3>`;
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
