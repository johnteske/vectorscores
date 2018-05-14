VS.layout = (function() {
    var layout = {};

    layout.header = document.getElementById('score-header');
    layout.footer = document.getElementById('score-footer');

    function setClass(c) {
        layout.header.className = c;
        layout.footer.className = c;
    }

    layout.show = function() {
        setClass('show');
    };

    layout.hide = function() {
        setClass('hide');
    };

    function addLayoutInteraction(el) {
        el.addEventListener('click', layout.show, false);
        el.addEventListener('mouseover', layout.show, false);
        el.addEventListener('mouseout', layout.hide, false);
    }

    addLayoutInteraction(layout.header);
    addLayoutInteraction(layout.footer);

    // TODO separate definition from instantiation
    // Hide layout when interacting with score
    document.getElementsByTagName('main')[0].onclick = layout.hide;

    return layout;
})();
