const requireRoot = require("app-root-path").require;

const partialPath = "partials";
const termLink = requireRoot(`${partialPath}/term-link.11ty.js`);
const termDescription = requireRoot(`${partialPath}/term-description.11ty.js`);

module.exports = () => `
<h4>Scenes</h3>
- Notation within rectangles is considered a "scene" of music, depicting the overall texture and quality of sound but not a literal representation, especially in the time domain.
- Notation outside scenes (pitch material and dynamics) provide qualities to shape the scene over time.

<h3>Timbre and Techniques</h3>
<dl>
    <dt>${termLink("glassy")}</dt>
    <dd>
D
        ${termDescription("glassy")}
    </dd>
</dl>
`;
