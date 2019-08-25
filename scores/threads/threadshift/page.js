export default function(selection) {
  const page = selection.append("g");

  let _scale = 1;

  function scale(_) {
    _scale = _;
    page.attr("transform", `scale(${_scale})`);
  }

  return {
    element: page,
    scale
  };
}
