---
layout: compress-js
---
/**
 * @param {string} name : name of inputs, type="radio"
 */
VS.RadioSetting = function(name) {
    this.elements = document.getElementsByName(name);
};

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

VS.RadioSetting.prototype.on = function(type, callback) {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].addEventListener(type, callback);
    }
};
