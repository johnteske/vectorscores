VS.layout = (function() {
    var layout = {};

    layout.header = document.getElementById("score-header");
    layout.footer = document.getElementById("score-footer");

    function setClass(c) {
        layout.header.className = c;

        if (layout.footer) {
            layout.footer.className = c;
        }
    }

    layout.show = function() {
        setClass("show");
    };

    layout.hide = function() {
        setClass("hide");
    };

    function addLayoutInteraction(el) {
        el.addEventListener("click", layout.show, false);
        el.addEventListener("mouseover", layout.show, false);
        el.addEventListener("mouseout", layout.hide, false);
    }

    addLayoutInteraction(layout.header);

    if (layout.footer) {
        addLayoutInteraction(layout.footer);
    }

    return layout;
})();

document.getElementsByTagName("main")[0].onclick = VS.layout.hide;
