"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const prng_1 = require("../intonations/prng");
const prng = prng_1.lcg(Date.now());
//const prng = lcg(666);
function coin(threshold = 0.5) {
  return prng() > threshold;
}
function typeWithSection(section) {
  return (type, _i, _a) => ({
    section,
    type,
  });
}
var Section;
(function (Section) {
  Section[(Section["Meta"] = 0)] = "Meta";
  Section[(Section["Exposition"] = 1)] = "Exposition";
  Section[(Section["Development"] = 2)] = "Development";
  Section[(Section["Recapitulation"] = 3)] = "Recapitulation";
})(Section || (Section = {}));
var Role;
(function (Role) {
  Role[(Role["Primary"] = 0)] = "Primary";
  Role[(Role["Transition"] = 1)] = "Transition";
  Role[(Role["Secondary"] = 2)] = "Secondary";
  Role[(Role["Development"] = 3)] = "Development";
  Role[(Role["Closing"] = 4)] = "Closing";
})(Role || (Role = {}));
// Array<{
//  section: meta | exposition | development | recapitulation
//  type: primary | transition | secondary | cod(ett)a/closing
//  next: { section, type }
// }>
function generate() {
  const hasSecondSubject = coin();
  const hasFirstSubjectInRecap = hasSecondSubject ? coin() : true;
  const exposition = [
    Role.Primary,
    ...(hasSecondSubject ? [Role.Transition, Role.Secondary] : []),
    ...(coin() ? [Role.Closing] : []),
    // todo transition, for the repeat?
  ]
    //.filter(Boolean)
    .map(typeWithSection(Section.Exposition));
  const development = [
    Role.Development,
    Role.Transition, // I think this is the only one we can't be sure where it is leading and need "next" for
  ]
    //.filter(Boolean)
    .map(typeWithSection(Section.Development));
  const recapitulation = [
    ...(hasFirstSubjectInRecap ? [Role.Primary] : []),
    ...(hasFirstSubjectInRecap && hasSecondSubject ? [Role.Transition] : []),
    ...(hasSecondSubject ? [Role.Secondary] : []),
    ...(coin() ? [Role.Closing] : []),
  ]
    //.filter(_ => _ != null)
    //.filter(Boolean)
    .map(typeWithSection(Section.Recapitulation));
  const coda = coin() ? [{ section: Section.Meta, type: Role.Closing }] : []; // coda
  return [
    coin() && { section: Section.Meta, type: Role.Transition },
    ...exposition,
    ...exposition,
    ...development,
    ...recapitulation,
    ...coda,
  ]; //.filter(Boolean);
}
exports.generate = generate;
