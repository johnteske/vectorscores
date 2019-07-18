const info = require('./_info')
const options = require('./_options')

module.exports = class {
  data() {
    return {
      layout: 'movement',
      title: 'prelude',
      status: 'wip',
      info: info(),
      options: options(),
      modules: [
        "dictionary",
        "bravura",
        "pitch-class",
        "settings/radio",
        "settings/number",
        "settings/pitch-classes",
        "line-cloud",
        "cue/blink"
      ]
    }
  }

  render(data) { return `` }
}
