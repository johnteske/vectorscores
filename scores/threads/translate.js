export default function DEPRECATED_translate(x, y, selection) {
  return selection.attr("transform", `translate(${x}, ${y})`);
}

export function translate(selection, x, y) {
  return selection.attr("transform", `translate(${x}, ${y})`);
}
