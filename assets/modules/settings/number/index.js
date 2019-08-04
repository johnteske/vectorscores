// TODO coerce number
/**
 * @param {string} name : name attribute of input, type="number"
 */
VS.NumberSetting = function(name) {
    this.element = document.getElementsByName(name)[0];
};

VS.NumberSetting.prototype.set = function(value) {
    this.element.value = value;
};
