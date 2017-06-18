TrashFire.noiseLayer = TrashFire.svg.append("g").attr("class", "noise-container");

TrashFire.noiseLayer
    .selectAll(".noise")
    .data(d3.range(0, 100)) // 100 layers
    .enter()
    .append("rect")
        .attr("class", "noise")
        .style("opacity", 0)
        .attr("fill", function() { return VS.getItem(["black", "white"]); })
        .attr("x", function() { return (Math.random() * TrashFire.view.width) - (TrashFire.view.width * 0.25); })
        .attr("y", function() { return Math.random() * TrashFire.view.height; })
        .attr("width", function() { return Math.random() * TrashFire.view.width; })
        .attr("height", 1);
