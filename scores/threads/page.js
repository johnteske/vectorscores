export default function(selection) {
  const page = selection.append("g");

  let _height = null;
  let _scale = 1;

  function calculateHeight() {
    _height = page.node().getBBox().height;
  }

  function height() {
    return _height;
  }

  function scale(_) {
    _scale = _;
    page.attr("transform", `scale(${_scale})`);
  }

  return {
    element: page,
    calculateHeight,
    height,
    scale
  };
}
