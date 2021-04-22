VS.saveSVG = {
  hooks: VS.createHooks(["save"]),
};

var element = document.getElementById("save-svg");

element.onclick = function (e) {
  VS.saveSVG.hooks.trigger("save");

  var svg = d3.select("svg").node();
  var svgXML = new XMLSerializer().serializeToString(svg);
  var data = "data:image/svg;charset=utf-8," + encodeURIComponent(svgXML);

  element.setAttribute("href", data);
  element.setAttribute("download", "score.svg");
};
