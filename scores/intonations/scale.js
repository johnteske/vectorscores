export const seconds = t => t * 1000;

export const pitchRange = 87;

export function pitchScale(value) {
  return (1 - value) * pitchRange;
}
