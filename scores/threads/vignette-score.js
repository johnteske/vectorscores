import { translate } from "./translate";
import { margin } from "./layout";
import { pitchRange } from "./scale";
import makePage from "./page";

export default function() {
  const svg = d3.select("svg.main");

  const page = makePage(svg);

  // Create hidden line to ensure page fits margins
  page.element
    .append("line")
    .attr("y2", margin.top + pitchRange + margin.top) // TODO this also duplicates the scroll score, should it be part of the page?
    .style("visibility", "hidden");

  const scoreGroup = page.element.append("g");
  translate(scoreGroup, 0, margin.top);

  return {
    svg,
    page,
    scoreGroup
  };
}
