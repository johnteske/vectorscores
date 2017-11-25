var scoreSettings = (function() {
    var generateButton = document.getElementById('settings-generate'),
        radioSetting = new VS.RadioSetting(document.getElementsByName('settings-pc-display'));

    var settings = {};

    settings.pcFormat = VS.getQueryString('pcs') || '';
    radioSetting.setValue(settings.pcFormat);

    settings.generate = function() {
        document.location.href = '?pcs=' + radioSetting.getValue();
    };
    generateButton.addEventListener('click', settings.generate);

    return settings;
})();
