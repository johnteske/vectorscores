var main = d3.select('.main'),
    wrapper = main.append('g'),
    topo = wrapper.append('g'),
    // width = 480,
    tileWidthHalf = 24,
    tileHeightHalf = tileWidthHalf * 0.5,
    heightScale = {
        revealed: 2.5,
        hidden: 1
    },
    score = {
        width: 8 // currently used in creation, not display
    },
    revealFactor = 38,
    nearbyRevealFactor = 23,
    transitionTime = 600,
    nEvents = 100;

var layout = {
    width: 400,
    height: 300,
    scale: 1,
    margin: {}
};
