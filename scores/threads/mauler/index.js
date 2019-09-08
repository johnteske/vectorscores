import drone from "../drone";
import makeIndicator from "../indicator";
import longTone from "../longTone";
import makePage from "../page";
import makeScroll from "../scroll";
import translate from "../translate";

const durations = VS.dictionary.Bravura.durations.stemless;

const margin = {
  top: 64
};

const pitchRange = 87;
function pitchScale(value) {
  return (1 - value) * pitchRange;
}

const svg = d3.select("svg.main");
svg.append("style").text(`
  .bravura { font-family: 'Bravura'; font-size: 20px; }
`);

const page = makePage(svg);
// Create hidden line to ensure page fits margins
page.element
  .append("line")
  .attr("y1", 0)
  .attr("y2", margin.top + pitchRange + 32) // TODO
  //.attr("y2", margin.top + pitchRange + margin.top)
  .style("visibility", "hidden");

const scoreGroup = makeScroll(page.element);
scoreGroup.y(margin.top); // TODO allow chaining
const wrapper = scoreGroup.element;

function sixteenths(selection) {
  const g = selection.append("g").attr("stroke", "black");

  const spacing = 5;

  [0, -1, 0, 2, 3].forEach((y, i) => {
    const x = i * spacing;

    g.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", 0 - y)
      .attr("y2", 10 - y);
  });

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * spacing)
    .attr("y1", 0)
    .attr("y2", 0 - 2)
    .attr("stroke-width", 2);

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 3 * spacing)
    .attr("y1", 0)
    .attr("y1", 3)
    .attr("y2", 3 - 2)
    .attr("stroke-width", 2);

  return g;
}

const score = [
  {
    startTime: null,
    duration: 3000,
    render: ({ startTime }) => {
      //const g = translate(startTime, 0, wrapper.append("g"))
      const g = translate(0, 0, wrapper.append("g"));

      const y = pitchScale(0.5);
      translate(
        0,
        y,
        g
          .append("text")
          .text("\uf58c")
          .attr("class", "bravura")
      );

      sixteenths(g).attr("transform", `translate(25, ${y}) scale(2,2)`);
    }
  },
  {
    startTime: null,
    duration: 3000,
    render: ({ startTime }) => {
      //const g = translate(startTime, 0, wrapper.append("g"))
      const g = translate(100, 0, wrapper.append("g"));
      // spike
      g.append("path").attr("d", "M-15,0 L15,0 L0,60 Z");
      // wall/tremolo--is it around the pitch center?
      translate(100, pitchScale(0.5), sixteenths(wrapper));
    }
  }
  //drone(wrapper);
  // semitone falls around drones, maybe the wall/texture fades over time
];

//score.forEach((bar, i) => {
//  const callback = i < score.length - 1 ? scrollToNextBar : null;
//  VS.score.add(bar.startTime, callback, [i, bar.duration]);
//});

function renderScore() {
  score.forEach(bar => {
    const { render, ...barData } = bar;
    render(barData);
  });
}

function resize() {
  VS.score.isPlaying() && VS.score.pause();

  const w = parseInt(svg.style("width"), 10);
  const h = parseInt(svg.style("height"), 10);

  const scale = h / page.height();
  page.scale(scale);

  const center = (w / scale) * 0.5;
  //  indicator.translateX(center);
  scoreGroup.setCenter(center);
  //  setScorePosition();
}

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  renderScore();
  page.calculateHeight();
  resize();
});
