---
layout: compress-js
---
// TODO coerce number
/**
 * @param {string} name : name of input, type="number"
 */
VS.NumberSetting = function(name) {
    this.element = document.getElementsByName(name)[0];
};

VS.NumberSetting.prototype.setValue = function(value) {
    this.element.value = value;
};
