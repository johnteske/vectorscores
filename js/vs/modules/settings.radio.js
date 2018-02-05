---
layout: compress-js
---
VS.RadioSetting = function(elements) {
    if (!(this instanceof VS.RadioSetting)) {
        return new VS.RadioSetting(elements);
    }

    this.elements = elements;
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
