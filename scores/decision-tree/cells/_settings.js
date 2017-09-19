var scoreSettings = (function() {
    var generateButton = document.getElementById("settings-generate"),
        radioSetting = new VS.RadioSetting(document.getElementsByName("settings-pc-display"));

    var settings = {};

    settings.pcFormat = "name";
    radioSetting.setValue(settings.pcFormat);

    generateButton.addEventListener("click", function() {
        document.location.href = "?pcs=" + radioSetting.getValue();
    });

    return settings;
})();
