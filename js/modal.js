// to add globally, beyond modal.js
var scoreHeader = document.getElementById("score-header"),
    scoreFooter = document.getElementById("score-footer");
function showHeader() {
    scoreHeader.className = "show";
}
function footerClassed(newClass) {
    if (scoreFooter) { scoreFooter.className = newClass; }
}
// not modal, but testing here
document.getElementById("score-header").onclick = showHeader;
document.getElementById("score-footer").onclick = footerClassed("show");
document.getElementsByTagName("main")[0].onclick = function() {
    document.getElementById("score-header").className = "hide";
    footerClassed("hide");
}
//

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
}
