---
layout: compress-js
---
/**
 * If d3 is not loaded from d3js.org, use the local copy
 */
window.d3 || document.write('<script src="{{ site.baseurl }}/js/d3.v3.min.js" charset="utf-8"><\/script>');

{% include_relative vs/_core/vs.js %}
{% include_relative vs/_core/helpers.js %}
{% include_relative vs/_core/layout.js %}
{% include_relative vs/_core/score.js %}
{% include_relative vs/_core/controls.js %}
{% include_relative vs/_core/modals.js %}
