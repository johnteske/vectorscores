---
layout: page
title: About
permalink: /about/
menu: true
---
{% capture readme %}{% include_relative README.md %}{% endcapture %}
{{ readme | replace: '*vectorscores*', '<span class="vectorscores">*vectorscores*</span>' }}
