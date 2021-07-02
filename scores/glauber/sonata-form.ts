import { lcg } from "../intonations/prng";

const prng = lcg(Date.now());
//const prng = lcg(666);

function coin(threshold = 0.5) {
  return prng() > threshold;
}

function typeWithSection(section: Section) {
  return (type: Role, _i: number, _a: Role[]) => ({
    section,
    type,
  });
}

enum Section {
  Meta,
  Exposition,
  Development,
  Recapitulation,
}

export enum Role {
  Primary,
  Transition,
  Secondary,
  Development,
  Closing, // including cod(ett)a
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
    Role.Primary,
    ...(hasSecondSubject ? [Role.Transition, Role.Secondary] : []),
    ...(coin() ? [Role.Closing] : []),
    // todo transition, for the repeat?
  ].map(typeWithSection(Section.Exposition));

  const development = [
    Role.Development, // TODO a unique role
    Role.Transition, // I think this is the only one we can't be sure where it is leading and need "next" for
  ].map(typeWithSection(Section.Development));

  const recapitulation = [
    ...(hasFirstSubjectInRecap ? [Role.Primary] : []),
    ...(hasFirstSubjectInRecap && hasSecondSubject ? [Role.Transition] : []),
    ...(hasSecondSubject ? [Role.Secondary] : []),
    ...(coin() ? [Role.Closing] : []),
  ].map(typeWithSection(Section.Recapitulation));

  const coda = coin() ? [{ section: Section.Meta, type: Role.Closing }] : []; // coda

  return [
    coin() && { section: Section.Meta, type: Role.Transition }, // introduction
    ...exposition,
    ...exposition, // repeat
    ...development,
    ...recapitulation,
    ...coda,
  ];
}
