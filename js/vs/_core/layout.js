VS.page = {
    header: document.getElementById("score-header"),
    footer: document.getElementById("score-footer"),
    headerClassed: function(newClass) {
        this.header.className = newClass;
    },
    footerClassed: function(newClass) {
        if (this.footer) { this.footer.className = newClass; }
    },
    showLayout: function() {
        VS.page.headerClassed("show");
        VS.page.footerClassed("show");
    },
    hideLayout: function() {
        VS.page.headerClassed("hide");
        VS.page.footerClassed("hide");
    }
};

VS.page.header.onclick = function() {
    VS.page.showLayout();
};

if (VS.page.footer) {
    VS.page.footer.onclick = function() {
        VS.page.showLayout();
    };
    VS.page.footer.addEventListener("mouseover", VS.page.showLayout, true);
    VS.page.footer.addEventListener("mouseout", VS.page.hideLayout, true);
}

document.getElementsByTagName("main")[0].onclick = function() {
    VS.page.headerClassed("hide");
    VS.page.footerClassed("hide");
};

VS.page.header.addEventListener("mouseover", VS.page.showLayout, true);
VS.page.header.addEventListener("mouseout", VS.page.hideLayout, true);
