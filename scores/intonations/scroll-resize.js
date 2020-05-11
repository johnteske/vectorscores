export default function makeResize(
  svg,
  page,
  margin,
  pitchRange,
  indicator,
  scoreGroup,
  setScorePosition
) {
  return function () {
    VS.score.isPlaying() && VS.score.pause();

    const w = parseInt(svg.style("width"), 10);
    const h = parseInt(svg.style("height"), 10);

    const scale = h / (margin.top + pitchRange + margin.top);
    page.scale(scale);

    const center = (w / scale) * 0.5;
    indicator.translateX(center);
    scoreGroup.setCenter(center);
    setScorePosition();
  };
}
