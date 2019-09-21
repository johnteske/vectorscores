const requireRoot = require("app-root-path").require;
const { catMap } = requireRoot("render-utils");

const whitelist = ["adsr", "prelude", "swell", "trashfire", "intonations"];

module.exports = class {
  data() {
    return {
      permalink: "/program/"
    };
  }

  render(data) {
    const works = data.collections.all
      .filter(w => ["score", "movement"].includes(w.data.layout))
      .filter(w => whitelist.some(name => w.url.includes(name)))
      .sort((a, b) => {
        const aOrder = a.data.order || -1;
        const bOrder = b.data.order || -1;
        return aOrder - bOrder;
      });

    return `
    <style>
      html {
        font-size: 12px;
        /* font-family: monospace; */
        width: 5.5in;
        height: 4.25in;
      }
      body {
        padding: 0.25in;
      }
      .work-title { font-family: serif; font-style: italic; }  
      h1 { margin: 0 0 1rem; }
      h2, h3 { font-weight: normal; }
      ul { list-style-position: inside; padding: 0; padding-left: 1em; list-style-type: disc }
    </style>
    <h1 class="work-title">vectorscores</h1>
    <p>graphic scores by John Teske<br />
    presented by Nonsequitur</p>
    <p>Wayward Music Series, Good Shepherd Center Chapel, Seattle<p>
    <p>Saturday, September 21, 2019 &mdash; 8 pm</p>

<h2>Any Ensemble</h2>
<ul>
<li>Greg Campbell, percussion</li>
<li>Luke Fitzpatrick, violin</li>
<li>Haley Freedlund, trombone</li>
<li>Noel Kennon, viola</li>
<li>John Teske, double bass</li>
<li>Neil Welch, saxophone</li>
</ul>

<h2>Program</h2>
  <ul>
      ${catMap(
        work => `<li class="work-title">${work.data.title}</li>`,
        works.filter(w => w.data.order < 2)
      )}
  </ul>
  <div style="margin-left: 1em">
  <p>brief intermission</p>
  <h3 class="work-title">intonations</h3>
  <ul>
      ${catMap(
        work => `<li class="work-title">${work.data.title}</li>`,
        works.filter(w => w.data.order > 2)
      )}
  </ul>
  </div>
`;
  }
};
