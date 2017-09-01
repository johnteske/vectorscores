VS.page = (function() {
    var page = {};

    page.header = document.getElementById("score-header");
    page.footer = document.getElementById("score-footer");

    page.layoutClassed = function(newClass) {
        page.header.className = newClass;
        if (page.footer) { page.footer.className = newClass; }
    };
    page.showLayout = function() {
        page.layoutClassed("show");
    };
    page.hideLayout = function() {
        page.layoutClassed("hide");
    };

    function addLayoutInteraction(el) {
        el.onclick = function() {
            page.showLayout();
        };
        el.addEventListener("mouseover", page.showLayout, true);
        el.addEventListener("mouseout", page.hideLayout, true);
    }

    addLayoutInteraction(page.header);
    if (page.footer) { addLayoutInteraction(page.footer); }

    return page;
})();

document.getElementsByTagName("main")[0].onclick = function() {
    VS.page.hideLayout();
};
