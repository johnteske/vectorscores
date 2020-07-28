const requireRoot = require("app-root-path").require;

const partialPath = "partials";
const termLink = requireRoot(`${partialPath}/term-link.11ty.js`);
const termDescription = requireRoot(`${partialPath}/term-description.11ty.js`);

module.exports = () => `
### Time
Time is written proportionally.
<!--, including durations. The release of notes is not shown—musicians should release in time. Play duration/phrase only once, not repeated. -->
Durations are indicated by note flags and stemless noteheads, including dotted values, at 60 beats per minute.
Above each bar is its duration in seconds for reference.
<ul>
    <li>
        <svg class="info-cue"></svg> score pointer and cues :
        The fixed arrow symbol indicates the current position in the score.
        Playing the score will start with a pre-roll of 3 seconds in which the pointer will flash before the score starts to scroll.

        The arrow symbol also appears above every bar from the beginning to section A, indicating that theses bars should be cued.

        For the start of the work and the bars to be cued, musicians should play off the leader's cue, not the score pointer.
        After section A, each part becomes more independent.
        Musicians should use the pointer to reference their relative position in the score.
    </li>
</ul>

### Pitch
As an ensemble, agree on a pitch center.
If the same pitch is not possible on all instruments, octave transposition is allowed.
All pitch is relative to the chosen pitch center, notated as <i class="symbol">&#xe261;</i>.

Per each note in a phrase or single attack, a performer may choose a quarter-tone (or other microtone) pitch from the given range of accidentals, relative to the pitch center.

For example, if the pitch center is
D<i class="symbol">&#xe261;</i> and the given range is
<i class="symbol">[ &#xe280;, &#xe262; ]</i>,
a musician may choose from
C<i class="symbol">&#xe282;</i>/D<i class="symbol">&#xe280;</i>,
D<i class="symbol">&#xe261;</i>,
D<i class="symbol">&#xe282;</i>, or
D<i class="symbol">&#xe262;</i> for each note in the phrase.

### Other symbols
<ul>
    <li>
        <span class="symbol">&#xe630;</span> ${termLink(
          "snap"
        )} : ${termDescription("snap")}
    </li>
    <li>
        <span class="symbol">&#xe0a9;</span> ghost note : muted, pitch deemphasized
    </li>
    <li>
        <svg class="info-ghost"></svg>
        beams: after initial attack, rapidly ${termLink(
          "hammer-on"
        )} additional notes
    </li>
</ul>

### Timbre and Techniques
<dl>
    <dt>${termLink("rolling")}</dt>
    <dd>
        ${termDescription("rolling")}
    </dd>
    <dd>
        ${termLink("rolling pizzicato")} for string instruments
    </dd>

    <dt>${termLink("glassy")}</dt>
    <dd>
        ${termDescription("glassy")}
    </dd>
    <dd>
        ${termLink("bow hair pull")} for string instruments
    </dd>

    <dt>${termLink("flutter")}</dt>
    <dd>
        ${termDescription("flutter")}
    </dd>
</dl>
`;
