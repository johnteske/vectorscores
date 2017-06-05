var scoreSettings = (function() {
    var generateButton = document.getElementById("settings-generate");

    var radioSetting = (function (elements) {
        var radio = {};

        radio.getValue = function() {
            for (var i = 0, length = elements.length; i < length; i++) {
                var thisElement = elements[i];
                if (thisElement.checked) {
                    return thisElement.value;
                }
            }
        };

        radio.setValue = function(value) {
            for (var i = 0, length = elements.length; i < length; i++) {
                var thisElement = elements[i];
                if (thisElement.value === value) {
                    thisElement.checked = true;
                    break;
                }
            }
        };

        return radio;
    })(document.getElementsByName("settings-pc-display"));

    var settings = {};

    settings.pcFormat = VS.getQueryString("pcs") || "";
    radioSetting.setValue(settings.pcFormat);

    settings.generate = function() {
        document.location.href = "?pcs=" + radioSetting.getValue();
    };
    generateButton.addEventListener("click", settings.generate);

    return settings;
})();
