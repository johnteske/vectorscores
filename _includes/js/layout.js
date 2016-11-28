VS.page = {
    header: document.getElementById("score-header"),
    footer: document.getElementById("score-footer"),
    headerClassed: function(newClass) {
        this.header.className = newClass;
    },
    footerClassed: function(newClass) {
        if (this.footer) { this.footer.className = newClass; }
    }
};

VS.page.header.onclick = function() {
    VS.page.headerClassed("show");
    // VS.page.footerClassed("show"); // conflicts with playCallback()
};

if (VS.page.footer) {
    VS.page.footer.onclick = function() {
        // VS.page.headerClassed("show"); // conflicts with playCallback()
        VS.page.footerClassed("show");
    };
}

document.getElementsByTagName("main")[0].onclick = function() {
    VS.page.headerClassed("hide");
    VS.page.footerClassed("hide");
};
