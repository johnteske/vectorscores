var modal = document.getElementById('score-info-modal'),
    info = document.getElementById("score-info"),
    closeSpan = document.getElementById("score-info-modal-close");

function openInfoModal() {
    modal.style.display = "block";
    document.getElementById("score-header").className = "show";
    document.getElementById("score-footer").className = "show";
    pause();
}

function closeInfoModal() {
    modal.style.display = "none";
    document.getElementById("score-header").className = "";
	document.getElementById("score-footer").className = "";
}

info.onclick = openInfoModal;

closeSpan.onclick = closeInfoModal;

window.onclick = function(event) {
    if (event.target == modal) { closeInfoModal(); }
}
