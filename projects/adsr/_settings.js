var scoreSettings = {
    parts: document.getElementById("settings-parts"),
    generate: document.getElementById("settings-generate")
};

scoreSettings.parts.value = numParts;

// TODO clean up
(function() {
    var showAll = document.getElementById("settings-showall"),
        checked = showAll.checked = true;

    showAll.disabled = true;
    scoreSettings.showAll = checked;
})();

scoreSettings.generate.onclick = function() {
    var qs = "?parts=" + scoreSettings.parts.value;
    qs += "&showall=" + (document.getElementById("settings-showall").checked ? 1 : 0);
    document.location.href = qs;
};
