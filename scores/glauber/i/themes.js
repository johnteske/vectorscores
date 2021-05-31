// make this available for variations
// it prob just dones't belong here tho
export const attributes = {
  duration: [0.25, 0.5, 1, 2, 4, 8],
  range: [16, 32, 64, 127], // can be much more granular than this
  timbre: ["glassy", "ord", "sul pont"],
  dynamics: ["pp", "p", "mp", "mf", "f", "ff"],
};

const attributeKeys = Object.keys(attributes);

// between 0-1
const attributeDisparities = shuffle([1.0, 0.75, 0.5, 0.25]);

const withDisp = shuffle(attributeKeys).reduce((acc, key, i) => {
  const scale = attributes[key];
  const disparity = attributeDisparities[i];
  const range = Math.round(scale.length * disparity); // TODO place this within the scale
  const start = scale.length - range;
  console.log(start, range, scale.length);
  const min = scale[start];
  const max = scale[start + range];

  return {
    ...acc,
    [key]: {
      disparity,
      scale,
      min,
      max,
    },
  };
}, {});
console.log(withDisp);

// object.freeze
const themes = {};
export default themes;

//

// TODO NOT A REAL FN
function shuffle(a) {
  return a.sort();
}
