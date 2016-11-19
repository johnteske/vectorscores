var modal = document.getElementById('score-info-modal'),
    info = document.getElementById("score-info"),
    closeSpan = document.getElementsByClassName("close")[0];

function openInfoModal() {
    modal.style.display = "block";
    document.getElementsByClassName("score-header")[0].className = "hide";
}

function closeInfoModal() {
    modal.style.display = "none";
}

info.onclick = openInfoModal;

closeSpan.onclick = closeInfoModal;

window.onclick = function(event) {
    if (event.target == modal) { closeInfoModal(); }
}
