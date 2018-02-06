var scoreSettings = (function() {
    var pcSettings = new VS.PitchClassSettings();

    var generateButton = document.getElementById('settings-generate');

    var settings = {
        pitchClasses: pcSettings.getValues()
    };

    function generate() {
        var pcSettingsValues = pcSettings.getValues();

        var queryString = VS.makeQueryString({
            'pc-display': pcSettingsValues.display,
            'pc-pref': pcSettingsValues.preference
        });

        document.location.href = '?' + queryString;
    }

    generateButton.addEventListener('click', generate);

    return settings;
})();
