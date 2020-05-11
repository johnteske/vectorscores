module.exports = (data) =>
  `<header id="score-header">
        <h1 class="score-title">${data.title}</h1>
        ${
          data.info || data.info_file
            ? '<button id="score-info-open" class="score-button" title="About the score">[i]</button>'
            : ""
        }
    </header>`;
