const { maybe } = require("eleventy-lib");

const infoModal = data =>
  `<div id="score-info-modal" class="modal-content">
        <span id="score-info-close" class="modal-close">×</span>
        <h2 class="score-title">${data.title}</h2>
        <p>
            ${maybe(data.composer)}
            ${maybe(data.publish_date)}
        </p>
	${maybe(`<p>for ${data.instrumentation}</p>`, data.instrumentation)}
        <p>${maybe(data.dedication)}</p>
	${maybe(`<div>${data.info}</div>`, data.info)}
    </div>`;

const optionsModal = data =>
  maybe(
    `<div id="score-options-modal" class="modal-content">
            <span id="score-options-close" class="modal-close">×</span>
            <h2>Options</h2>
            <div>${data.options}</div>
        </div>`,
    data.options
  );

module.exports = data =>
  `<div id="score-modal-overlay" class="modal-overlay">
        ${infoModal(data)}
	${optionsModal(data)}
    </div>`;
