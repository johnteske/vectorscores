export default (bar, i, score) => {
  // Calculate and set startTimes
  const startTime = score
    .slice(0, i)
    .reduce((sum, b, j) => sum + b.duration, 0);
  return { ...bar, startTime };
};
