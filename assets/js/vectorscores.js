---
layout: compress-js
---

var VS = {};

{% include_relative _helpers.util.js %}
{% include_relative _helpers.math.js %}
{% include_relative _layout.js %}
{% include_relative _score.js %}
{% include_relative _controls.js %}
{% include_relative _modals.js %}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VS;
}
