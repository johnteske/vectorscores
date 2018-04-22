<div class="settings-group">
    <label for="settings-parts">Number of parts (1–16):</label>
    <input type="number" min="1" max="16" id="settings-parts">
</div>
<div class="settings-group">
    <label for="settings-showall">Show all parameters:</label>
    <input id="settings-showall" type="checkbox">
</div>

{% include score/settings/generate-button.html %}

{% comment %}
<div class="settings-group">
    <label>Pre-roll (3–15 s):</label>
    <input type="number" id="settings-preroll">
</div>
{% endcomment %}

{% include score/settings/websocket.html %}
