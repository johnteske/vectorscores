VS.enableModal = function(idPrefix) {
    var modal = document.getElementById(idPrefix + '-modal');
    var openTrigger = document.getElementById(idPrefix + '-open');
    var closeTrigger = document.getElementById(idPrefix + '-close');
    var overlay = document.getElementById('score-modal-overlay'); // wraps all score modals

    function openModal() {
        showModalAndOverlay(true);

        VS.score.pause();
        VS.layout.show();
        VS.control.listenForKeydown(false);

        listenForModalEvents(true);
    }

    function closeModal() {
        showModalAndOverlay(false);

        VS.layout.hide();
        VS.control.listenForKeydown(true);

        listenForModalEvents(false);
    }

    function showModalAndOverlay(shouldShow) {
        var method = shouldShow ? 'add' : 'remove';

        overlay.classList[method]('show');
        modal.classList[method]('show');
    }

    function listenForModalEvents(shouldListen) {
        var method = shouldListen ? 'addEventListener' : 'removeEventListener';

        closeTrigger[method]('click', closeModal, true);
        window[method]('click', clickListener, true);
        window[method]('keydown', keydownListener, true);
    }

    function clickListener(event) {
        (event.target === overlay) && closeModal();
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
    VS.enableModal('score-info');
}
if (document.getElementById('score-options-open')) {
    VS.enableModal('score-options');
}
