---
layout: compress-js
---
/**
 * @param {string} name : name of inputs, type="radio"
 */
VS.RadioSetting = function(name) {
    this.elements = document.getElementsByName(name);
};

// For use in settings, not directly by composer
VS.RadioSetting.prototype.getValue = function() {
    for (var i = 0, length = this.elements.length; i < length; i++) {
        var thisElement = this.elements[i];

        if (thisElement.checked) {
            return thisElement.value;
        }
    }
};

VS.RadioSetting.prototype.setValue = function(value) {
    for (var i = 0, length = this.elements.length; i < length; i++) {
        var thisElement = this.elements[i];

        if (thisElement.value === value) {
            thisElement.checked = true;
            break;
        }
    }
};
