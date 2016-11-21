var modal = document.getElementById('score-info-modal'),
    info = document.getElementById("score-info"),
    closeSpan = document.getElementById("score-info-modal-close");

function openInfoModal() {
    modal.style.display = "block";
    showHeader();
    footerClassed("show");
    if (typeof pause === "function") { //
        pause();
    }
}

function closeInfoModal() {
    modal.style.display = "none";
    document.getElementById("score-header").className = "";
	footerClassed("");
}

info.onclick = openInfoModal;

closeSpan.onclick = closeInfoModal;

window.onclick = function(event) {
    if (event.target == modal) { closeInfoModal(); }
};
