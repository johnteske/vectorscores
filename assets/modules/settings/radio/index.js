/**
 * @param {string} name : name attribute of inputs, type="radio"
 */
VS.RadioSetting = function(name) {
    this.elements = document.getElementsByName(name);
};

// For use in settings, not directly by composer
VS.RadioSetting.prototype.get = function() {
    for (var i = 0, length = this.elements.length; i < length; i++) {
        var thisElement = this.elements[i];

        if (thisElement.checked) {
            return thisElement.value;
        }
    }
};

VS.RadioSetting.prototype.set = function(value) {
    for (var i = 0, length = this.elements.length; i < length; i++) {
        var thisElement = this.elements[i];

        if (thisElement.value === value) {
            thisElement.checked = true;
            break;
        }
    }
};
