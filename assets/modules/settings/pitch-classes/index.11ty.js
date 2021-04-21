const radioGroup = require("./../radio-group.11ty.js");

module.exports = () => `
<div id="settings-pitch-classes">
    <section>
        <h4>Display pitch classes as:</h4>
        ${radioGroup("pitch-classes", [
          { label: "Pitch class numbers", value: "numbers" },
          { label: "Note names", value: "names" },
        ])}
    </section>

    <section id="pitch-classes-numbers-preferences">
        <h4>Display pitch classes 10 and 11 as:</h4>
        ${radioGroup("prefer", [
          { label: "T and E", value: "te" },
          { label: "A and B", value: "ab" },
        ])}
    </section>

    <section id="pitch-classes-names-preferences">
        <h4>Display accidentals as:</h4>
        ${radioGroup("prefer", [
          // TODO duplicate names
          { label: "sharps", value: "sharps" },
          { label: "flats", value: "flats" },
        ])}
    </section>
</div>`;
