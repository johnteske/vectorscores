const main = d3.select("main");
main.select("svg").remove();

main.selectAll("button").on("click", function() {
  const url = d3.select(this).text();
  VS.WebSocket.send(["ws", "redirect", url]);
});

main
  .append("button")
  .text("reload")
  .on("click", () => {
    VS.WebSocket.send(["ws", "reload"]);
  });

VS.WebSocket.connect();
