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

            window.removeEventListener("keydown", VS.control.keydownListener, true);

            window.addEventListener("click", clickListener, true);
            window.addEventListener("keydown", keydownListener, true);
        }

        function closeInfoModal() {
            VS.modal.overlay.style.display = "none";
            VS.page.headerClassed("");
            VS.page.footerClassed("");

            window.removeEventListener("click", clickListener, true);
            window.removeEventListener("keydown", keydownListener, true);

            window.addEventListener("keydown", VS.control.keydownListener, true);
        }

        function clickListener(event) {
            if (event.target === VS.modal.overlay) {
                closeInfoModal();
            }
        }

        function keydownListener(event) {
            if (event.defaultPrevented) {
                return;
            }

            switch (event.key) {
                case "Escape":
                    closeInfoModal();
                    break;
                default:
                    return;
            }
            event.preventDefault();
        }

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
