// attributes
// - duration (x density)
// - range (y density)
// - timbre
// - dynamics

import { seconds, pitchRange, pitchScale } from "../../intonations/scale";
import { translate } from "../../intonations/translate";
import startTimeFromDuration from "../../intonations/startTimeFromDuration";

import { generate as generateForm, Section, Role } from "../sonata-form";
import * as scrollingScore from "../scrolling-score";

import themes from "./themes";

//import { lcg } from "../intonations/prng";
// TODO share prng and seed throughout entire score
const prng = () => Math.random(); // lcg(Date.now());

function timeScale(t) {
  return t / 150;
}

const durations = VS.dictionary.Bravura.durations.stemless;

// TODO
console.log("themes", themes);

//
const makePattern = (name, contentFn) => (selection) => {
  const p = selection
    .append("pattern")
    .attr("id", name)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", pitchRange) // to make it square
    .attr("height", pitchRange);

  p.call(contentFn);
};

// TODO ensure some more even distribution
// https://www.jasondavies.com/poisson-disc/
function addGlyphsWithDensity(selection, glyph, density) {
  for (let i = 0; i < density; i++) {
    selection
      .append("text")
      .text(glyph)
      .style("font-family", "Bravura")
      .attr("dx", pitchScale(prng()))
      .attr("dy", pitchScale(prng()));
  }
}

// TODO example patterns to visualize form
const patterns = [
  // Section TODO
  makePattern("meta", (p) => {
    p.append("text")
      .text(durations[8])
      .style("font-family", "Bravura")
      .attr("dy", "1em");
  }),
  // Role
  makePattern(Role.Primary, (p) => {
    p.append("g").call(addGlyphsWithDensity, durations[1], 5);
  }),
  makePattern(Role.Secondary, (p) => {
    p.append("g").call(addGlyphsWithDensity, durations[0.5], 5);
  }),
  makePattern(Role.Closing, (p) => {
    p.append("g").call(addGlyphsWithDensity, durations[2], 5);
  }),
];
//

const form = generateForm();

// TODO VS.score events should have at least 1 event
// the current render function expects duration => startTime => x, width
//
// currently the form maps directly to the score
// TODO development section needs filling
//
function nested(val, n) {
  const ratio = 0.62;
  let result = val;
  for (let i = 0; i < n; i++) {
    result = result * ratio;
  }
  return result;
}

const score = form
  .map((f) => {
    // TODO what is the timing of these sections
    const duration = {
      [Role.Primary]: 10000 * nested(1, 0),
      [Role.Transition]: 10000 * nested(1, 2),
      [Role.Secondary]: 10000 * nested(1, 1),
      [Role.Development]: 10000 * 2,
      [Role.Closing]: 10000 * nested(1, 2),
    }[f.type];

    return {
      duration,
      render: (g, data) => {
        const rect = g
          .append("rect")
          .attr("width", data.width)
          .attr("height", pitchRange)
          // outline for debugging
          .attr("stroke", "gray")
          .attr("vector-effect", "non-scaling-stroke");
        //
        if (f.section === Section.Meta) {
          rect.attr("fill", `url(#${f.section})`);
        } else if (f.type === Role.Transition) {
          // prev
          rect.attr("fill", `url(#${f.prev.type})`);
          // TODO duplicated
          g.append("rect")
            .attr("width", data.width)
            .attr("height", pitchRange)
            // outline for debugging
            //.attr("stroke", "gray")
            //.attr("vector-effect", "non-scaling-stroke")
            .attr("fill", `url(#${f.next.type})`);
        } else {
          rect.attr("fill", `url(#${f.type})`);
        }
      },
    };
  })
  .concat([
    {
      duration: 0,
    },
  ])
  .map(startTimeFromDuration)
  .map((bar) => ({
    ...bar,
    x: timeScale(bar.startTime),
    width: timeScale(bar.duration),
  }));

/**
 * Render--and also register hooks, events, cue blink, etc
 * TODO render is too specific of a name
 */
scrollingScore.render((svg, g, score) => {
  const defs = svg.append("defs");
  patterns.forEach((p) => {
    defs.call(p);
  });

  score.forEach((bar) => {
    const { render, ...data } = bar;
    if (render == null) {
      return;
    }
    const _g = g.append("g").call(translate, data.x, 0);
    render(_g, data);
  });

  const durations = g.append("g");
  score
    .filter((b) => b.duration !== 0)
    .forEach((bar) => {
      durations
        .append("text")
        .style("font-size", "9px")
        .style("font-family", "monospace")
        .text(`${decimalRound(bar.duration / 1000, 1)}\u2033`)
        .attr("x", bar.x);
    });
}, score);

// TODO copied from ad;sr
function decimalRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
