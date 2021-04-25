import { lcg } from "../intonations/prng";

const prng = lcg(Date.now());
//const prng = lcg(666);

function coin(threshold = 0.5) {
  return prng() > threshold;
}

function typeWithSection(section) {
  return (type) => ({
    section,
    type,
  });
}

// Array<{
//  section: meta | exposition | development | recapitulation
//  type: primary | transition | secondary | cod(ett)a/closing
//  next: { section, type }
// }>
export function generate() {
  const hasSecondSubject = coin();
  const hasFirstSubjectInRecap = hasSecondSubject ? coin() : true;

  const exposition = [
    "primary",
    hasSecondSubject && "transition",
    hasSecondSubject && "secondary",
    coin() && "closing",
    // todo transition, for the repeat?
  ]
    .filter(Boolean)
    .map(typeWithSection("exposition"));

  const development = [
    "any", // TODO no enum for this
    "transition", // I think this is the only one we can't be sure where it is leading and need "next" for
  ]
    .filter(Boolean)
    .map(typeWithSection("development"));

  const recapitulation = [
    hasFirstSubjectInRecap && "primary",
    hasFirstSubjectInRecap && hasSecondSubject && "transition",
    hasSecondSubject && "secondary",
    coin() && "closing",
  ]
    .filter(Boolean)
    .map(typeWithSection("recapitulation"));

  return [
    coin() && { section: "meta", type: "transition" }, // introduction
    ...exposition,
    ...exposition, // repeat
    ...development,
    ...recapitulation,
    coin() && { section: "meta", type: "closing" }, // coda
  ].filter(Boolean);
}
