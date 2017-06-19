var scoreSettings = (function() {
    var generateButton = document.getElementById("settings-generate"),
        radioSetting = new RadioSetting(document.getElementsByName("settings-pc-display"));

    var settings = {};

    settings.pcFormat = "name"; // VS.getQueryString("pcs") || "";
    radioSetting.setValue(settings.pcFormat);

    settings.generate = function() {
        document.location.href = "?pcs=" + radioSetting.getValue();
    };
    generateButton.addEventListener("click", settings.generate);

    return settings;
})();
