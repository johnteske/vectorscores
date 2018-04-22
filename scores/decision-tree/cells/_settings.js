// TODO Use or hide "transpose by" option
var scoreSettings = (function() {
    var pcSettings = new VS.PitchClassSettings();

    var generateButton = document.getElementById('settings-generate');

    var settings = {
        pitchClasses: pcSettings.getValues()
    };

    function generate() {
        var queryStringParams = pcSettings.getQueryStringParams();

        var queryString = VS.makeQueryString(queryStringParams);

        document.location.href = '?' + queryString;
    }

    generateButton.addEventListener('click', generate);

    return settings;
})();
