<div class="settings-group">
    <label>Number of parts (1–16): <input type="number" min="1" max="16" name="settings-parts"></label>
</div>
<div class="settings-group">
    <label>Show parameters on each measure: <input name="settings-showall" type="checkbox"></label>
</div>

{% include score/settings/generate-button.html %}

{% include score/settings/websocket.html %}
