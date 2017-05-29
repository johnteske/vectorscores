var scoreSettings = (function() {
    var pcDisplayRadios = document.getElementsByName("settings-pc-display"),
        generateButton = document.getElementById("settings-generate");

    function getRadioValue(elements) {
        for (var i = 0, length = elements.length; i < length; i++) {
            var thisElement = elements[i];
            if (thisElement.checked) {
                return thisElement.value;
            }
        }
    }
    function setRadioValue(elements, value) {
        for (var i = 0, length = elements.length; i < length; i++) {
            var thisElement = elements[i];
            if (thisElement.value === value) {
                thisElement.checked = true;
                break;
            }
        }
    }

    var settings = {};

    settings.pcFormat = VS.getQueryString("pcs") || "";
    setRadioValue(pcDisplayRadios, settings.pcFormat);

    settings.generate = function() {
        document.location.href = "?pcs=" + getRadioValue(pcDisplayRadios);
    };
    generateButton.addEventListener("click", settings.generate);

    return settings;
})();
