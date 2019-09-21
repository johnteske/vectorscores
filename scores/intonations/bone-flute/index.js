import startTimeFromDuration from "../startTimeFromDuration";
import { seconds, pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import drawDynamics from "../dynamics";
import { translate } from "../translate";
import pathAlongPath from "../pathAlongPath";

const { svg, page } = makeVignetteScore();

svg.append("style").text(`
  text {
    font-size: 8px;
  }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

const wrapper = page.element;

const text = (selection, str) => selection.append("text").text(str);
const ensemble = (selection, str) =>
  selection
    .append("text")
    .text(str)
    .attr("fill", "blue")
    .attr("text-anchor", "end");

function makeFrame(selection) {
  return selection
    .append("rect")
    .attr("width", pitchRange)
    .attr("height", pitchRange)
    .attr("fill", "none")
    .attr("stroke", "blue");
}

function textureOfBones(selection) {
  const g = selection.append("g").attr("fill", "darkRed");

  // TODO these could be animated to emphasize the crushing
  for (let i = 0; i < 66; i++) {
    g.append("text")
      .text("\u2620")
      .style("font-size", "20px")
      .attr("x", pitchScale(Math.random() * 1))
      .attr("y", pitchScale(Math.random() * 0.25));
  }

  ensemble(g, "L,H,G").call(translate, 0, pitchScale(0.25));
  g.append("text")
    .text("crushing")
    //.text("crushing bones")
    .attr("y", pitchScale(0.25))
    .attr("dy", "1em")
    .attr("fill", "black")
    .style("font-family", "monospace");

  drawDynamics(
    [
      {
        type: "symbol",
        value: "mp",
        x: 0
      }
    ],
    0,
    g
  )
    .call(translate, 0, pitchScale(0.5))
    .attr("fill", "black");

  return g;
}

// high, cheerful, taunting
// solo
// taunting
// TODO also needs bounding box
const boneFlutePhraseGenerator = pathAlongPath(d3.curveBasis, d3.curveBasis);

const encouragement = [
  "worry not, friend",
  "it can be so easy",
  "embrace the release",
  "it's time to rest",
  "accept the inevitable"
].sort(() => Math.random() - 0.5);

function boneFlute(selection) {
  const g = selection.append("g");

  boneFlutePhraseGenerator(
    [
      { x: 10, y: VS.getRandExcl(0, 20) },
      { x: pitchRange * 0.5, y: VS.getRandExcl(0, 20) },
      { x: pitchRange - 10, y: VS.getRandExcl(0, 20) }
    ],
    [...new Array(10)],
    (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-5, 5) }),
    g
  );

  ensemble(g, "Neil:").attr("dy", "1em");

  text(g, encouragement.pop())
    //text(g, "it can be so easy")
    .attr("dy", "1em")
    .attr("fill", "darkred");

  drawDynamics(
    [
      {
        type: "symbol",
        value: "f",
        x: 0
      }
    ],
    0,
    g
  )
    .attr("fill", "black")
    .call(translate, 0, -20);

  return g;
}

function drone(selection) {
  const g = selection.append("g");

  // mid-range drones
  ensemble(g, "NK,J").call(translate, 0, pitchScale(0.5));
  translate(g.append("line"), 0, pitchScale(0.5))
    .attr("x2", pitchRange)
    .attr("stroke", "black");
  drawDynamics(
    [
      {
        type: "symbol",
        value: "mp",
        x: 0
      }
    ],
    0,
    g
  )
    .attr("fill", "black")
    .call(translate, 0, pitchScale(0.5))
    .select("text")
    .attr("dy", "0.5em");

  return g;
}

const boneFluteFrame = () => {
  const g = wrapper.append("g");
  //makeFrame(g);
  boneFlute(g);
  drone(g);
  textureOfBones(g);
  return g;
};

const score = [
  {
    duration: 0,
    render: () => {
      return wrapper.append("g");
    }
  },
  {
    duration: seconds(20),
    render: boneFluteFrame
  },
  {
    duration: seconds(20),
    render: boneFluteFrame
  },
  {
    duration: seconds(20),
    render: boneFluteFrame
  },
  {
    duration: seconds(20),
    render: boneFluteFrame
  },
  {
    duration: seconds(20),
    render: boneFluteFrame
  },
  {
    duration: 0,
    render: () => {
      return wrapper.append("g");
    }
  }
].map(startTimeFromDuration);

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
