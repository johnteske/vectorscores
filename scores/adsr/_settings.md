<div class="settings-group">
    <label for="settings-parts">Number of parts (1–16):</label>
    <input type="number" min="1" max="16" id="settings-parts">
</div>
<div class="settings-group">
    <label><input name="settings-showall" type="checkbox"> Show parameters on each measure</label>
</div>

{% include score/settings/generate-button.html %}

{% comment %}
<div class="settings-group">
    <label>Pre-roll (3–15 s):</label>
    <input type="number" id="settings-preroll">
</div>
{% endcomment %}

{% include score/settings/websocket.html %}
