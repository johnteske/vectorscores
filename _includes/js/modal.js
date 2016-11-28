if (document.getElementById("score-info-modal")) {
    VS.modal = (function () {

        var overlay = document.getElementById("score-info-modal"),
            infoOpen = document.getElementById("score-info"),
            infoClose = document.getElementById("score-info-modal-close");

        infoOpen.onclick = openInfoModal;
        infoClose.onclick = closeInfoModal;

        function openInfoModal() {
            VS.modal.overlay.style.display = "block";
            VS.page.headerClassed("show");
            VS.page.footerClassed("show");
            if (VS.page.footer) {
                VS.score.pause();
            }
        }

        function closeInfoModal() {
            VS.modal.overlay.style.display = "none";
            VS.page.headerClassed("");
            VS.page.footerClassed("");
        }

        window.onclick = function(event) { // addEventHandler?
            if (event.target === VS.modal.overlay) { closeInfoModal(); }
        };

        return {
            overlay: overlay,
            info: {
                openElement: infoOpen,
                closeElement: infoClose,
                open: openInfoModal,
                close: closeInfoModal
            }
        };

    })();
}
