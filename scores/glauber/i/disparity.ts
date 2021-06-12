import { lcg, integerBetween } from "../../intonations/prng";

const rando = lcg(Date.now());

export function selectItems<T>(scale: T[], disparity: number): [T, T] {
  if (disparity < 0 || disparity > 1) {
    throw new Error("disparity must be between [0, 1] (inclusive)");
  }

  const range = Math.round((scale.length - 1) * disparity);
  const start = integerBetween(rando, 0, scale.length - range);
  const min = scale[start];
  const max = scale[start + range];

  return [min, max];
}
