export const layout = (function() {
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

    function addLayoutInteraction(element) {
        element.addEventListener('click', layout.show, false);
        element.addEventListener('mouseover', layout.show, false);
        element.addEventListener('mouseout', layout.hide, false);
    }

    addLayoutInteraction(header);
    addLayoutInteraction(footer);

    // Hide layout when interacting with score
    document.getElementsByTagName('main')[0].addEventListener('click', layout.hide, false);

    return layout;
})();
