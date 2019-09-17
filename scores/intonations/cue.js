const glyphs = {
  open: "\ue893",
  closed: "\ue890"
};

export default function cue(selection, type = "closed") {
  return selection
    .append("text")
    .attr("class", "bravura wip")
    .attr("text-anchor", "middle")
    .text(glyphs[type]);
}
