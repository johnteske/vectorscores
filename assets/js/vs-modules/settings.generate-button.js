---
layout: compress-js
---
/**
 * @param {string} name : name of input, type="checkbox"
 */
VS.GenerateButton = function(id) {
    this.element = document.getElementById(id);

    this.element.addEventListener('click', function() {
        VS.score.options.setFromUI();
        document.location.href = '?' + VS.score.options.makeQueryString();
    });
};
