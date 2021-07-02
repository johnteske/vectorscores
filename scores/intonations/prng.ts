type Lcg = () => number;

export const lcg = (seed: number): Lcg => () =>
  ((seed = Math.imul(741103597, seed)) >>> 0) / 2 ** 32;

// Excludes max
// TODO rename, with excl
export const floatBetween = (lcg: Lcg, min: number, max: number) =>
  lcg() * (max - min) + min;

// Includes max
// TODO rename, with incl
export const integerBetween = (lcg: Lcg, min: number, max: number) =>
  Math.floor(floatBetween(lcg, min, max));

export function itemFrom<T>(lcg: Lcg, items: T[]) {
  return items[Math.floor(lcg() * items.length)];
}

export function itemFromWeighted<T>(lcg: Lcg, items: T[], weights: number[]) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const rand = floatBetween(lcg, 0, totalWeight);

  for (let i = 0, acc = 0; i < items.length; i++) {
    acc += weights[i];

    if (rand <= acc) {
      return items[i];
    }
  }
}
