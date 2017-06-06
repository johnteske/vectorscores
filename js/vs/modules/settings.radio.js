function RadioSetting(elements) {
    if (!(this instanceof RadioSetting)) {
        return new RadioSetting(elements);
    }

    this.elements = elements;
}

RadioSetting.prototype.getValue = function() {
    for (var i = 0, length = this.elements.length; i < length; i++) {
        var thisElement = this.elements[i];
        if (thisElement.checked) {
            return thisElement.value;
        }
    }
};

RadioSetting.prototype.setValue = function(value) {
    for (var i = 0, length = this.elements.length; i < length; i++) {
        var thisElement = this.elements[i];
        if (thisElement.value === value) {
            thisElement.checked = true;
            break;
        }
    }
};
