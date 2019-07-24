const options = require("./_options.11ty.js");

const info = () => `
<p>
When the score is playing, tap or click on one of the cells or use the up and down arrow keys to choose a cell.
The parameters of the cell you choose will be more likely to appear in future cells.
</p>
<p>
Play the phrase in the selected box using the pitch classes shown outside the box.
The quarter rest is used generically to indicate the player should rest.
</p>
`;

module.exports = class {
  data() {
    return {
      layout: "score",
      title: "cell branching",
      composer: "John Teske",
      instrumentation: "any ensemble",
      formats: ["parts"],
      status: "wip",
      info: info(),
      options: options(),
      modules: [
        "bravura",
        "dictionary",
        "pitch-class",
        "settings/radio",
        "settings/pitch-classes",
        "websockets",
        "trichords"
      ]
    };
  }

  render(data) {
    return `<p class="debug monospace"></p>`;
  }
};
