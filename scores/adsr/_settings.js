var scoreSettings = {};

scoreSettings.parts = document.getElementById('settings-parts');

scoreSettings.parts.value = numParts;

// scoreSettings.preroll = (function() {
//     var preroll = document.getElementById("settings-preroll");
//
//     var _min = 3,
//         _max = 15;
//
//     preroll.min = _min;
//     preroll.max = _max;
//     preroll.step = 0.5;
//
//     preroll.addEventListener("change", function() {
//         this.value = VS.clamp(this.value, _min, _max);
//         VS.score.preroll = this.value * 1000;
//     }, false);
//
//     return preroll;
// })();

scoreSettings.pitchDisplay = 'accidentals'; // "integers"

scoreSettings.generate = document.getElementById('settings-generate');

(function() {
    var showAll = new VS.CheckboxSetting('settings-showall');
    showAll.setValue(+VS.getQueryString('showall'));
    scoreSettings.showAll = showAll.getValue();

    scoreSettings.generate.onclick = function() {
        var qs = '?parts=' + scoreSettings.parts.value;
        qs += '&showall=' + (showAll.getValue() ? 1 : 0);
        document.location.href = qs;
    };
}());
