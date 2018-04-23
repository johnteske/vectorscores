---
layout: compress-js
---
/**
 * @param {string} name : name of input, type="checkbox"
 */
VS.CheckboxSetting = function(name) {
    this.element = document.getElementsByName(name)[0];
};

VS.CheckboxSetting.prototype.getValue = function() {
    return this.element.checked ? 1 : 0;
};

VS.CheckboxSetting.prototype.setValue = function(value) {
    this.element.checked = value === 'on';
};
