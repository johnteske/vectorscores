VS.header = document.getElementById("score-header");
VS.footer = document.getElementById("score-footer");

function showHeader() {
    VS.header.className = "show";
}
function footerClassed(newClass) {
    if (VS.footer) { VS.footer.className = newClass; }
}

VS.header.onclick = showHeader;
if (VS.footer) {
    VS.footer.onclick = footerClassed("show");
}
document.getElementsByTagName("main")[0].onclick = function() {
    VS.header.className = "hide";
    footerClassed("hide");
};
