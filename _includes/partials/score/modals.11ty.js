const rootRequire = require('app-root-path').require;
const { handleUndefined } = rootRequire('render-utils')

const infoModal = data => 
    `<div id="score-info-modal" class="modal-content">
        <span id="score-info-close" class="modal-close">×</span>
        <h2 class="score-title">${data.title}</h2>
        <p>
            ${data.composer}
            ${handleUndefined(data.publish_date)}
        </p>
	${data.instrumentation ? '<p>for ${data.instrumentation}</p>' : ''}
        <p>${handleUndefined(data.dedication)}</p>
        ${data.info ? '<div>${data.info}</div>' : ''}
    </div>`; 

const optionsModal = data => data.options ?
    `<div id="score-options-modal" class="modal-content">
        <span id="score-options-close" class="modal-close">×</span>
        <h2>Options</h2>
        ${data.options ? '<div>${data.options}</div>' : ''}
    </div>` :
    '';

module.exports = data =>
    `<div id="score-modal-overlay" class="modal-overlay">
        ${infoModal(data)}
	${optionsModal(data)}
    </div>`;
