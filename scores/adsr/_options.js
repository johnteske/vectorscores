VS.score.options.add('parts', 4, new VS.NumberSetting('parts'));
VS.score.options.add('verbose', 'off', new VS.CheckboxSetting('verbose'));

var scoreOptions = VS.score.options.setFromQueryString();
scoreOptions.parts = VS.clamp(scoreOptions.parts, 1, 16);
