VS.page = (function() {
    var page = {};

    page.header = document.getElementById("score-header");
    page.footer = document.getElementById("score-footer");

    page.layoutClassed = function(c) {
        page.header.className = c;
        if (page.footer) { page.footer.className = c; }
    };
    page.showLayout = function() {
        page.layoutClassed("show");
    };
    page.hideLayout = function() {
        page.layoutClassed("hide");
    };

    function addLayoutInteraction(el) {
        el.addEventListener("click", page.showLayout, false);
        el.addEventListener("mouseover", page.showLayout, false);
        el.addEventListener("mouseout", page.hideLayout, false);
    }

    addLayoutInteraction(page.header);
    if (page.footer) { addLayoutInteraction(page.footer); }

    return page;
})();

document.getElementsByTagName("main")[0].onclick = VS.page.hideLayout;
