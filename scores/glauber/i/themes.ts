import attributes from "./attributes";
import { selectItems } from "./disparity";

const attributeKeys = Object.keys(attributes);

// between 0-1
const attributeDisparities = shuffle([1.0, 0.75, 0.5, 0.25]);

//const withDisp = shuffle(attributeKeys).reduce((acc, key, i) => {
//  const scale = attributes[key];
//  const disparity = attributeDisparities[i];
//  const [min, max] = fromDisp(scale, disparity);
//  return {
//    ...acc,
//    [key]: {
//      disparity,
//      scale,
//      min,
//      max,
//    },
//  };
//}, {});
//console.log(withDisp);

// Object.freeze
const themes = {};
export default themes;

// TODO NOT A REAL FN
function shuffle(a: number[]) {
  return a.sort();
}
