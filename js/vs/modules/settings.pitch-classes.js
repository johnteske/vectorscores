---
layout: compress-js
---
VS.PitchClassSettings = function(elements) {
    var self = this;

    if (!VS.RadioSetting) {
        throw new Error('[VS.PitchClassSettings] requires VS.RadioSetting module');
    }

    // Radio settings
    this.displayRadio = new VS.RadioSetting('settings-pc-display');
    this.pitchClassPrefRadio = new VS.RadioSetting('settings-pc-preference');
    this.noteNamePrefRadio = new VS.RadioSetting('settings-notename-preference');

    // Wrappers for preferences
    this.pitchClassPreference = document.getElementById('pitchclass-preference');
    this.noteNamePreference = document.getElementById('notename-preference');

    // Init values from query string
    this.display = VS.getQueryString('pc-display') || '';
    this.preference = VS.getQueryString('pc-pref') || '';

    // Update UI
    this.displayRadio.setValue(this.display);
    this.updatePreferences();
    if (this.display === 'name') {
        this.noteNamePrefRadio.setValue(this.preference);
    } else {
        this.pitchClassPrefRadio.setValue(this.preference);
    }

    // Listen for changes
    this.displayRadio.on('change', function(e) {
        self.display = e.target.value;
        self.updatePreferences();
    });
};

VS.PitchClassSettings.prototype.getValues = function() {
    var preference;

    if (this.display === 'name') {
        preference = this.noteNamePrefRadio.getValue();
    } else {
        preference = this.pitchClassPrefRadio.getValue();
    }

    return {
        display: this.display,
        preference: preference
    };
};

VS.PitchClassSettings.prototype.updatePreferences = function() {
    if (this.display === 'name') {
        this.pitchClassPreference.style.display = 'none';
        this.noteNamePreference.style.display = 'block';
    } else {
        this.pitchClassPreference.style.display = 'block';
        this.noteNamePreference.style.display = 'none';
    }
};
