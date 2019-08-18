export default function translate(x, y, selection) {
  return selection.attr("transform", `translate(${x}, ${y})`);
}
