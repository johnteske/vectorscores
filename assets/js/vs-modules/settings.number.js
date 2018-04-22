---
layout: compress-js
---
/**
 * @param {string} name : name of input, type="number"
 */
VS.NumberSetting = function(name) {
    this.element = document.getElementsByName(name)[0];
};

VS.NumberSetting.prototype.getValue = function() {
    return this.element.value;
};

VS.NumberSetting.prototype.setValue = function(value) {
    this.element.value = value;
};
