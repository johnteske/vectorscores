export default function addHooks(setScorePosition) {
  VS.control.hooks.add("step", setScorePosition);
VS.WebSocket.hooks.add("step", setScorePosition);

VS.control.hooks.add("pause", setScorePosition);
VS.WebSocket.hooks.add("pause", setScorePosition);

VS.score.hooks.add("stop", setScorePosition);
}
