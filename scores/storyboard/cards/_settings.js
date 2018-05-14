var scoreSettings = (function() {
    var generateButton = document.getElementById('settings-generate'),
        radioSetting = new VS.RadioSetting(document.getElementsByName('settings-pc-display'));

    var settings = {};

    settings.pcFormat = VS.getQueryString('pcs') || '';
    radioSetting.set(settings.pcFormat);

    generateButton.addEventListener('click', function() {
        document.location.href = '?pcs=' + radioSetting.get();
    });

    return settings;
})();
