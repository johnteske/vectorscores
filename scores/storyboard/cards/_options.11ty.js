module.exports = () => `
Display pitch classes as:
<div style="margin: 1em 0;">
  <input type="radio" name="settings-pc-display" value="integer" checked> Integers<br>
  <input type="radio" name="settings-pc-display" value="name"> Note names<br>
</div>
<button id="settings-generate">Generate new score</button>
`;