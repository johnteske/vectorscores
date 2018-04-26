---
layout: compress-js
---
/**
 * Creates a set of inputs:
 * - pitch-classes (display pitch classes by numbers or note names)
 * - prefer (preferences related to the pitch-classes selection)
 * TODO add support for B -> H and Bb -> B?
 */
VS.PitchClassSettings = function() {

    var self = this;

    if (!VS.RadioSetting) {
        throw new Error('[VS.PitchClassSettings] requires VS.RadioSetting module');
    }

    // Radio settings
    this.pitchClassesRadio = new VS.RadioSetting('pitch-classes');
    this.preferRadio = new VS.RadioSetting('prefer');

    // Update preference options shown when changing pitch class display
    for (var i = 0; i < this.pitchClassesRadio.elements.length; i++) {
        var el = this.pitchClassesRadio.elements[i];
        el.addEventListener('change', function() {
            self.updatePreferences();
        });
    }
};

VS.PitchClassSettings.prototype.updatePreferences = function() {

    var pitchClassesValue = this.pitchClassesRadio.get();

    // Hide/show sections
    document.getElementById('pitch-classes-numbers-preferences').style.display = (pitchClassesValue === 'numbers') ? 'block' : 'none';
    document.getElementById('pitch-classes-names-preferences').style.display = (pitchClassesValue === 'names') ? 'block' : 'none';

    var preferValue = this.preferRadio.get();

    // Set to the first preference if switching pitch class display
    if (pitchClassesValue === 'numbers' && (preferValue !== 'te' && preferValue !== 'ab')) {
        this.preferRadio.set('te');
    } else if (pitchClassesValue === 'names' && (preferValue !== 'sharps' && preferValue !== 'flats')) {
        this.preferRadio.set('sharps');
    }
};

VS.PitchClassSettings.prototype.set = function(obj) {
    this.pitchClassesRadio.set(obj['pitch-classes']);
    this.preferRadio.set(obj['prefer']);

    this.updatePreferences();
};
