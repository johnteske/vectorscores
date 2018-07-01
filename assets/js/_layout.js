VS.layout = (function() {
    var layout = {};

    var header = document.getElementById('score-header');
    var footer = document.getElementById('score-footer');

    function makeClassSetter(className) {
        return function() {
            header.className = className;
            footer.className = className;
        };
    }

    layout.show = makeClassSetter('show');
    layout.hide = makeClassSetter('hide');

    function addLayoutInteraction(el) {
        el.addEventListener('click', layout.show, false);
        el.addEventListener('mouseover', layout.show, false);
        el.addEventListener('mouseout', layout.hide, false);
    }

    addLayoutInteraction(header);
    addLayoutInteraction(footer);

    // TODO separate definition from instantiation
    // Hide layout when interacting with score
    document.getElementsByTagName('main')[0].onclick = layout.hide;

    return layout;
})();
