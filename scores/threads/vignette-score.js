import { translate } from "./translate";
import { margin } from "./layout";
import { pitchRange } from "./scale";
import makePage from "./page";

export default function() {
  const svg = d3.select("svg.main");

  const page = makePage(svg);

  return {
    svg,
    page
  };
}
