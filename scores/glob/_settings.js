var scoreSettings = (function() {
    var pcDisplaySetting = new VS.RadioSetting(document.getElementsByName('settings-pc-display'));
    var pcPrefs = new VS.RadioSetting(document.getElementsByName('settings-pc-preference'));
    var notenamePrefs = new VS.RadioSetting(document.getElementsByName('settings-notename-preference'));

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

    settings.pcFormat = VS.getQueryString('pitch-class-display') || '';

    pcDisplaySetting.setValue(settings.pcFormat);
    pcDisplaySetting.on('change', function(e) {
        showPreferences(e.target.value);
    });

    settings.pcPreference = VS.getQueryString('pitch-class-pref') || '';

    if (settings.pcFormat === 'name') {
        notenamePrefs.setValue(settings.pcPreference);
    } else {
        pcPrefs.setValue(settings.pcPreference);
    }
    showPreferences(settings.pcFormat);

    function generate() {
        var displaySetting = pcDisplaySetting.getValue();
        var displayPref = (displaySetting === 'name') ? notenamePrefs.getValue() : pcPrefs.getValue();
        // pcPrefs
        document.location.href = '?pitch-class-display=' + displaySetting + '&pitch-class-pref=' + displayPref;
    }

    generateButton.addEventListener('click', generate);

    return settings;
})();
