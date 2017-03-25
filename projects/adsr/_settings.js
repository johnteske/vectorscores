var scoreSettings = {
    parts: document.getElementById("settings-parts"),
    generate: document.getElementById("settings-generate")
};

scoreSettings.parts.value = numParts;
scoreSettings.generate.onclick = function() {
    document.location.href = "?parts=" + scoreSettings.parts.value;
};
