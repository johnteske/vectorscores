score.header = document.getElementById("score-header");
score.footer = document.getElementById("score-footer");

function showHeader() {
    score.header.className = "show";
}
function footerClassed(newClass) {
    if (score.footer) { score.footer.className = newClass; }
}

score.header.onclick = showHeader;
if (score.footer) {
    score.footer.onclick = footerClassed("show");
}
document.getElementsByTagName("main")[0].onclick = function() {
    score.header.className = "hide";
    footerClassed("hide");
};
