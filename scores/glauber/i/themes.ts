import { lcg, integerBetween } from "../../intonations/prng";

//// make this available for variations
//// it prob just dones't belong here though
//export const attributes = {
//  duration: [0.25, 0.5, 1, 2, 4, 8],
//  range: [16, 32, 64, 127], // can be much more granular than this
//  timbre: ["glassy", "ord", "sul pont"],
//  dynamics: ["pp", "p", "mp", "mf", "f", "ff"],
//};
//
//const attributeKeys = Object.keys(attributes);
//
//// between 0-1
//const attributeDisparities = shuffle([1.0, 0.75, 0.5, 0.25]);

const rando = lcg(Date.now());

export function fromDisp<T>(scale: T[], disparity: number): [T, T] {
  if (disparity < 0 || disparity > 1) {
    throw new Error("disparity must be between [0, 1] (inclusive)");
  }
  const range = Math.round((scale.length - 1) * disparity);
  const start = integerBetween(rando, 0, scale.length - range);
  const min = scale[start];
  const max = scale[start + range];
  return [min, max];
}

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

// object.freeze
const themes = {};
export default themes;

// TODO NOT A REAL FN
//function shuffle(a) {
//  return a.sort();
//}
