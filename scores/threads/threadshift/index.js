import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

// drone(wrapper);

var durations = VS.dictionary.Bravura.durations.stemless;

function longTone(selection, x, y, duration) {
  const group = selection.append("g");

  group.attr("transform", `translate(${x}, ${y})`);

  group
    .append("text")
    .attr("class", "bravura")
    .text(durations[4]);

  group
    .append("line")
    .attr("x1", "0.5em")
    .attr("x2", x + duration);

  return group;
}

const score = [
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const g = longTone(wrapper, startTime, 50, duration);
      g.append("text").text(">");
      g.append("text").text("p, cres., mf");
    }
  },
  {
    startTime: null,
    duration: null,
    render: ({ startTime }) => {
      wrapper
        .append("text")
        .text("cluster //")
        .attr("transform", `translate(${startTime},50)`);
    }
  }
  // solo part drops below and ensemble plays ghost of former long tone
  // threads are revealed by ensemble as the solo line becomes stable
].map((bar, i) => {
  // TODO each bar is saet to the same duration during sketching
  const length = 150;
  return { ...bar, duration: length, startTime: length * i };
});

score.forEach(bar => {
  const { render, ...barData } = bar;
  render(barData);
});
