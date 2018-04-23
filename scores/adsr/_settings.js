VS.score.options.add('parts', 4, new VS.NumberSetting('settings-parts'));
VS.score.options.add('showall', 1, new VS.CheckboxSetting('settings-showall'));

var scoreOptions = VS.score.options.setFromQueryString();
VS.score.options.updateUI();

new VS.GenerateButton('settings-generate');
