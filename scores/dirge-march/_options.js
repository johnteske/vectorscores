VS.score.options.add('pitchClasses', { 'pitch-classes': 'numbers', 'prefer': 'te' }, new VS.PitchClassSettings());
VS.score.options.add('transposition', 0, new VS.NumberSetting('transposition'));

var scoreOptions = VS.score.options.setFromQueryString();

// TODO working with old property names in score, for now
scoreOptions.pitchClasses.display = scoreOptions.pitchClasses['pitch-classes'];
scoreOptions.pitchClasses.preference = scoreOptions.pitchClasses['prefer'];

// TODO should coerce internally
scoreOptions.transposition = +scoreOptions.transposition;
