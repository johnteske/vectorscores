export default function resize(svg, wrapper, pitchRange) {
  return function() {
    const w = parseInt(svg.style("width"), 10);
    const h = parseInt(svg.style("height"), 10);

    const scaleX = w / pitchRange;
    const scaleY = h / pitchRange;
    const scale = Math.min(scaleX, scaleY);

    const leftMargin = w * 0.5 - pitchRange * 0.5 * scale;
    const topMargin = h * 0.5 - pitchRange * 0.5 * scale;

    wrapper.attr(
      "transform",
      `translate(${leftMargin}, ${topMargin}) scale(${scale})`
    );
  };
}
