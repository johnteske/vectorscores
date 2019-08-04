/**
 * @param {string} name : name attribute of input, type="checkbox"
 */
VS.CheckboxSetting = function(name) {
    this.element = document.getElementsByName(name)[0];
};

VS.CheckboxSetting.prototype.set = function(value) {
    this.element.checked = value === 'on';
};
