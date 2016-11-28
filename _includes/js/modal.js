var modal = document.getElementById("score-info-modal"),
    info = document.getElementById("score-info"),
    closeSpan = document.getElementById("score-info-modal-close");

function openInfoModal() {
    modal.style.display = "block";
    VS.page.headerClassed("show");
    VS.page.footerClassed("show");
    if (VS.page.footer) {
        VS.score.pause();
    }
}

function closeInfoModal() {
    modal.style.display = "none";
    VS.page.headerClassed("");
    VS.page.footerClassed("");
}

info.onclick = openInfoModal;

closeSpan.onclick = closeInfoModal;

window.onclick = function(event) {
    if (event.target === modal) { closeInfoModal(); }
};
