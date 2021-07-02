// attributes
// - duration (x density)
// - range (y density)
// - timbre
// - dynamics

import { seconds, pitchRange, pitchScale } from "../../intonations/scale";
import { translate } from "../../intonations/translate";
import startTimeFromDuration from "../../intonations/startTimeFromDuration";

import { generate as generateForm, Role } from "../sonata-form";
import * as scrollingScore from "../scrolling-score";

import themes from "./themes";

function timeScale(t) {
  return t / 200;
}

const durations = VS.dictionary.Bravura.durations.stemless;

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
    p.append("text")
      .text(durations[1])
      .style("font-family", "Bravura")
      .attr("dy", "1em");
  }),
  makePattern(Role.Transition, (p) => {
    p.append("text")
      .text(durations[0.75])
      .style("font-family", "Bravura")
      .attr("dy", "1em");
  }),
  makePattern(Role.Secondary, (p) => {
    p.append("text")
      .text(durations[0.5])
      .style("font-family", "Bravura")
      .attr("dy", "1em");
  }),
  makePattern(Role.Closing, (p) => {
    p.append("text")
      .text(durations[2])
      .style("font-family", "Bravura")
      .attr("dy", "1em");
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
const score = form
  .map((f) => {
    // TODO what is the timing of these sections
    const duration =
      {
        primary: 5000,
        secondary: 4000,
        transition: 3000,
        closing: 2000,
      }[f.type] || 10000;

    return {
      duration,
      render: (g, data) => {
        g.append("rect")
          .attr("width", data.width)
          .attr("height", pitchRange)
          // outline for debugging
          .attr("stroke", "gray")
          .attr("vector-effect", "non-scaling-stroke")
          //
          .attr("fill", `url(#${f.section === "meta" ? "meta" : f.type})`);
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
}, score);
