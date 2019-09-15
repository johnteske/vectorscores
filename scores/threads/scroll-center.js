export default function makeScrollFunctions(scoreGroup, xValues) {
  function centerScoreByIndex(index, duration) {
    const x = xValues[index];
    scoreGroup.scrollTo(x, duration);
  }

  return {
    setScorePosition: function() {
      const index = VS.score.getPointer();
      centerScoreByIndex(index, 0);
    },
    scrollToNextBar: function(index, duration) {
      centerScoreByIndex(index + 1, duration);
    }
  };
}
