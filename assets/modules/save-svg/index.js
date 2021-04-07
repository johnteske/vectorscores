var element = document.getElementById("save-svg");

element.onclick = function (e) {
  var svgXML = new XMLSerializer().serializeToString(d3.select("svg").node());
  var encoded = encodeURI(svgXML);

  element.setAttribute(
    "href",
    "data:text/svg;charset=utf-8," + encodeURIComponent(encoded)
  );
  element.setAttribute("download", "score.svg");
};
