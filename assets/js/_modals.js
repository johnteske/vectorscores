VS.enableModal = function(modalId, openId, closeId) {
    var modal = document.getElementById(modalId),
        openTrigger = document.getElementById(openId),
        closeTrigger = document.getElementById(closeId),
        overlay = document.getElementById('score-modal-overlay'); // wraps all score modals

    function openModal() {
        overlay.style.display = 'block';
        modal.style.display = 'block';

        VS.layout.show();
        VS.score.pause();
        VS.control.enableKeyDownListener(false);

        closeTrigger.addEventListener('click', closeModal, true);
        window.addEventListener('click', clickListener, true);
        window.addEventListener('keydown', keydownListener, true);
    }

    function closeModal() {
        overlay.style.display = 'none';
        modal.style.display = 'none';

        VS.layout.hide();
        VS.control.enableKeyDownListener(true);

        closeTrigger.removeEventListener('click', closeModal, true);
        window.removeEventListener('click', clickListener, true);
        window.removeEventListener('keydown', keydownListener, true);
    }

    function clickListener(event) {
        if (event.target === overlay) { closeModal(); }
    }

    function keydownListener(event) {
        if (event.defaultPrevented) { return; }

        switch (event.key) {
        case 'Escape':
            closeModal();
            break;
        default:
            return;
        }

        event.preventDefault();
    }

    openTrigger.addEventListener('click', openModal, true);
};

// TODO separate definition from instantiation
if (document.getElementById('score-info-open')) {
    VS.enableModal('score-info-modal', 'score-info-open', 'score-info-close');
}
if (document.getElementById('score-options-open')) {
    VS.enableModal('score-options-modal', 'score-options-open', 'score-options-close');
}
