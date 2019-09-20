export const lcg = seed => () => ((seed = Math.imul(741103597, seed)) >>> 0) / 2 ** 32;
