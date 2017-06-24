---
layout: page
title: Performances
permalink: /performances/
menu: true
---
{% for perf in site.data.performances %}
### [{{ perf.date }}]({{ perf.url }})<br />{{ perf.title }}
{% for work in perf.works %}
{% for pg in site.pages %}
{% if pg.title == work %}
[{{ work }}]({{ pg.url | relative_url }})
{% endif %}
{% endfor %}
{% endfor %}
{{ perf.address }}
{{ perf.time }}, {{ perf.price }}
{% endfor %}
