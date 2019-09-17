import startTimeFromDuration from "../startTimeFromDuration";
import { pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import { translate } from "../translate";

const { svg, page } = makeVignetteScore();

const wrapper = page.element;

function phrase() {
  var notes = [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }];

  function addNote() {
    var dir = VS.getItem([-1, 1, -2, 2, -3, 3]);
    dir = dir * 2;
    notes.push({ pitch: 2 * dir, duration: 1 });
    notes.push({ pitch: 2 * dir, duration: 0 });
  }

  for (var i = 0; i < 8; i++) {
    addNote();
  }

  return notes;
}

function chant(selection, length) {
  var lineCloud = VS.lineCloud()
    .duration(10)
    .phrase(phrase())
    .curve(d3.curveLinear)
    .width(length)
    .height(pitchRange * 0.333);

  selection
    .call(lineCloud, { n: 2 })
    .attr("fill", "none")
    .attr("stroke", "black")
    .call(translate, 0, pitchScale(0.666))
    // line-cloud has issues, not to be solved now
    .select(".line-cloud-path:last-child")
    .remove();
  return selection;
}

const score = [
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    }
  },
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    }
  },
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    }
  },
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    }
  },
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    }
  }
]
  .map(startTimeFromDuration)
  .map(bar => ({ ...bar, length: pitchRange }));

function renderScore() {
  score.forEach((bar, i) => {
    const { render, ...data } = bar;
    render(data)
      .attr("class", `frame frame-${i}`)
      .style("opacity", 0);
  });
}

const showFrame = i => {
  d3.selectAll(".frame").style("opacity", 0);
  d3.selectAll(`.frame-${i}`).style("opacity", 1);
};

score.forEach((bar, i) => {
  const callback = () => {
    showFrame(i);
  };
  VS.score.add(bar.startTime, callback, [i, bar.duration]);
});

const resize = makeVignetteResize(svg, wrapper, pitchRange);

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  renderScore();
  showFrame(0);
  resize();
});

const showFrameAtPointer = () => {
  const index = VS.score.getPointer();
  showFrame(index);
};

VS.control.hooks.add("step", showFrameAtPointer);
VS.WebSocket.hooks.add("step", showFrameAtPointer);

VS.control.hooks.add("pause", showFrameAtPointer);
VS.WebSocket.hooks.add("pause", showFrameAtPointer);

VS.score.hooks.add("stop", showFrameAtPointer);

VS.WebSocket.connect();
