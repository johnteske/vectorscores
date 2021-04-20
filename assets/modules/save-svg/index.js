var element = document.getElementById("save-svg");

element.onclick = function (e) {
  var svgXML = new XMLSerializer().serializeToString(d3.select("svg").node());

  element.setAttribute(
    "href",
    "data:text/svg;charset=utf-8," + encodeURIComponent(svgXML)
  );
  element.setAttribute("download", "score.svg");
};
