var scoreSettings = {};

scoreSettings.parts = new VS.NumberSetting('settings-parts');
scoreSettings.parts.setValue(numParts);

scoreSettings.pitchDisplay = 'accidentals'; // "integers"

scoreSettings.generate = document.getElementById('settings-generate');

(function() {
    var showAll = new VS.CheckboxSetting('settings-showall');
    showAll.setValue(+VS.getQueryString('showall'));
    scoreSettings.showAll = showAll.getValue();

    scoreSettings.generate.onclick = function() {
        var qs = '?parts=' + scoreSettings.parts.getValue();
        qs += '&showall=' + (showAll.getValue() ? 1 : 0);
        document.location.href = qs;
    };
}());
