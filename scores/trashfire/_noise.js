/**
 * TODO make noise noisier, similar to trash/fire paths
 * TODO stash noise elements, reposition on resize if needed
 */
TrashFire.noiseLayer = (function() {
    var noiseLayer = {};

    noiseLayer.selection = TrashFire.wrapper.append("g").attr("class", "noise-container");

    function x() {
        return (Math.random() * layout.main.width) - (layout.main.width * 0.25);
    }

    function y() {
        return Math.random() * layout.main.height;
    }

    function w() {
        return Math.random() * layout.main.width;
    }

    function h() {
        return Math.random() * 2;
    }

    noiseLayer.add = function(delay, n) {
        noiseLayer.selection
            .selectAll(".noise")
            .data(d3.range(0, n))
            .enter()
            .append("rect")
                .attr("class", "noise")
                .style("opacity", 0)
                .attr("fill", "#888888")
                .attr("x", x)
                .attr("y", y)
                .attr("width", w)
                .attr("height", h)
                // pop in
                .transition().duration(0)
                .delay(function(d, i) { return i * delay; })
                .style("opacity", 1);
        updateTrash();
    }

    noiseLayer.remove = function(delay) {
        noiseLayer.selection
            .selectAll(".noise")
                .transition().duration(0)
                .delay(function(d, i) { return i * delay; })
                .remove();
        updateTrash();
    }

    return noiseLayer;
})();
