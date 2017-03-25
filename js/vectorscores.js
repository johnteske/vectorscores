---
layout: compress-js
---
/**
 * If d3 is not loaded from d3js.org, use the local copy
 */
window.d3 || document.write('<script src="{{ site.baseurl }}/js/d3.v3.min.js" charset="utf-8"><\/script>');

{% include js/vs.js %}
{% include js/helpers.js %}
{% include js/layout.js %}
{% include js/score.js %}
{% include js/controls.js %}
{% include js/modals.js %}
