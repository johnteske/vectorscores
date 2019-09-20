export const lcg = seed => () =>
  ((seed = Math.imul(741103597, seed)) >>> 0) / 2 ** 32;

// Excludes max
export const floatBetween = (lcg, min, max) => lcg() * (max - min) + min;

// Includes max
export const integerBetween = (lcg, min, max) =>
  Math.floor(floatBetween(lcg, min, max));

export const itemFrom = (lcg, items) => items[Math.floor(lcg() * items.length)];

export const itemFromWeighted = (lcg, items, weights) => {
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const rand = floatBetween(lcg, 0, totalWeight);

  for (let i = 0, acc = 0; i < items.length; i++) {
    acc += weights[i];

    if (rand <= acc) {
      return items[i];
    }
  }
};
