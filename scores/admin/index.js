const main = d3.select("main");
main.select("svg").remove();

main
  .append("button")
  .text("reload")
  .on("click", () => {
    VS.WebSocket.send(["ws", "reload"]);
  });

VS.WebSocket.connect();
