TrashFire.noiseLayer = TrashFire.svg.append("g").attr("class", "noise-container");

function addNoise(nElements) {
    TrashFire.noiseLayer
        .selectAll(".noise")
        .data(d3.range(0, nElements))
        .enter()
        .append("rect")
            .attr("class", "noise")
            .style("opacity", 0)
            .attr("fill", function() { return VS.getItem(["grey", "white"]); })
            .attr("x", function() { return (Math.random() * TrashFire.view.width) - (TrashFire.view.width * 0.25); })
            .attr("y", function() { return Math.random() * TrashFire.view.height; })
            .attr("width", function() { return Math.random() * TrashFire.view.width; })
            .attr("height", function() { return Math.random() * 5; })
            // pop in
            .transition().duration(0)
            .delay(function(d, i) { return i * 5; })
            .style("opacity", 1);
    updateTrash();
}

function removeNoise() {
    TrashFire.noiseLayer
        .selectAll(".noise")
        .remove();
    updateTrash();
}
