VS.enableModal = function(openId, closeId, overlayId) {
    var openTrigger = document.getElementById(openId),
        closeTrigger = document.getElementById(closeId),
        overlay = document.getElementById(overlayId);

    function openModal() {
        overlay.style.display = "block";
        VS.page.headerClassed("show");
        VS.page.footerClassed("show");
        if (VS.page.footer) { VS.score.pause(); }

        closeTrigger.addEventListener("click", closeModal, true);
        window.removeEventListener("keydown", VS.control.keydownListener, true);
        window.addEventListener("click", clickListener, true);
        window.addEventListener("keydown", keydownListener, true);
    }

    function closeModal() {
        overlay.style.display = "none";
        VS.page.headerClassed("");
        VS.page.footerClassed("");

        closeTrigger.removeEventListener("click", closeModal, true);
        window.removeEventListener("click", clickListener, true);
        window.removeEventListener("keydown", keydownListener, true);
        window.addEventListener("keydown", VS.control.keydownListener, true);
    }

    function clickListener(event) {
        if (event.target === overlay) { closeModal(); }
    }

    function keydownListener(event) {
        if (event.defaultPrevented) { return; }

        switch (event.key) {
        case "Escape":
            closeModal();
            break;
        default:
            return;
        }
        event.preventDefault();
    }

    openTrigger.addEventListener("click", openModal, true);
};

// TODO this check belongs in document.ready
if (document.getElementById("score-info-modal")) {
    VS.enableModal("score-info", "score-info-modal-close", "score-info-modal");
}
