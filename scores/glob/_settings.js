var scoreSettings = (function() {
    var pcDisplayRadio = new VS.RadioSetting('settings-pc-display');
    var pcPrefRadio = new VS.RadioSetting('settings-pc-preference');
    var notenamePrefRadio = new VS.RadioSetting('settings-notename-preference');

    var pitchClassPreference = document.getElementById('pitchclass-preference');
    var noteNamePreference = document.getElementById('notename-preference');
    var generateButton = document.getElementById('settings-generate');

    function showPreferences(value) {
        if (value === 'name') {
            pitchClassPreference.style.display = 'none';
            noteNamePreference.style.display = 'block';
        } else {
            pitchClassPreference.style.display = 'block';
            noteNamePreference.style.display = 'none';
        }
    }

    var settings = {};

    settings.pcDisplay = VS.getQueryString('pc-display') || '';

    pcDisplayRadio.setValue(settings.pcDisplay);
    pcDisplayRadio.on('change', function(e) {
        showPreferences(e.target.value);
    });

    settings.pcPreference = VS.getQueryString('pc-pref') || '';

    if (settings.pcDisplay === 'name') {
        notenamePrefRadio.setValue(settings.pcPreference);
    } else {
        pcPrefRadio.setValue(settings.pcPreference);
    }
    showPreferences(settings.pcDisplay);

    function generate() {
        var displaySetting = pcDisplayRadio.getValue();
        var displayPref = (displaySetting === 'name') ? notenamePrefRadio.getValue() : pcPrefRadio.getValue();
        document.location.href = '?pc-display=' + displaySetting + '&pc-pref=' + displayPref;
    }

    generateButton.addEventListener('click', generate);

    return settings;
})();
