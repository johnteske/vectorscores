VS.score = {
    header: document.getElementById("score-header"),
    footer: document.getElementById("score-footer"),
    headerClassed: function(newClass) {
        this.header.className = newClass;
    },
    footerClassed: function(newClass) {
        if (this.footer) { this.footer.className = newClass; }
    }
};

VS.score.header.onclick = function() {
    VS.score.headerClassed("show");
    // VS.score.footerClassed("show"); // conflicts with playCallback()
};

if (VS.score.footer) {
    VS.score.footer.onclick = function() {
        // VS.score.headerClassed("show"); // conflicts with playCallback()
        VS.score.footerClassed("show");
    };
}

document.getElementsByTagName("main")[0].onclick = function() {
    VS.score.headerClassed("hide");
    VS.score.footerClassed("hide");
};
