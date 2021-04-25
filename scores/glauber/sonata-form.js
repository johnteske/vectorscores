import { lcg } from "../intonations/prng";

const prng = lcg(Date.now());
//const prng = lcg(666);

function coin(threshold = 0.5) {
  return prng() > threshold;
}

export function generate() {
  // first subject group
  // n subjects

  const hasSecondSubject = coin();
  const hasFirstSubjectInRecap = hasSecondSubject ? coin() : true;

  // second subject group
  // optional
  // n subjects

  const exposition = [
    "exp, first subject group",
    // ... and all the 1st subjects
    hasSecondSubject && "exp, transition",
    hasSecondSubject && "exp, second subject group",
    // ... and all the 2nd subjects
    coin() && "exp, closing theme",
    coin() && "exp, codetta",
  ];

  return [
    coin() && "introduction",
    ...exposition,
    ...exposition, // optional repeat
    "development",
    hasFirstSubjectInRecap && "recap, first subject group",
    hasFirstSubjectInRecap && hasSecondSubject && "recap, transition",
    hasSecondSubject && "recap, second subject group",
    coin() && "recap, codetta",
    coin() && "coda",
  ].filter(Boolean);
}
