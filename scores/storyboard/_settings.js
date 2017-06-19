var scoreSettings = (function() {
    var generateButton = document.getElementById("settings-generate"),
        radioSetting = new RadioSetting(document.getElementsByName("settings-pc-display"));

    var settings = {};

    settings.pcFormat = "name"; // VS.getQueryString("pcs") || "";
    radioSetting.setValue(settings.pcFormat);

    generateButton.addEventListener("click", function() {
        document.location.href = "?pcs=" + radioSetting.getValue();
    });

    return settings;
})();
