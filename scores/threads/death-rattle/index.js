import drone from "../drone";
// const drone = require("../drone")

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);
