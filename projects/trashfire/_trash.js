function Trash(width, height) {
    return {
        group: dumpster.trash.append("g")
            // TODO create at dumpster center
            .attr("transform", "translate(" + dumpster.center.x + ","  + dumpster.center.y + ")"),
        width: width,
        height: height,
        center: {
            x: width * 0.5,
            y: height * 0.5
        }
    };
}
