var modal = document.getElementById('score-info-modal'),
    info = document.getElementById("score-info"),
    closeSpan = document.getElementsByClassName("close")[0];

info.onclick = function() {
    modal.style.display = "block";
}

closeSpan.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
