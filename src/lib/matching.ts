export type MatchSkill = { name: string; kind: string };
const normalize = (value: string) => value.trim().toLowerCase();
export function matchStudents(mine: MatchSkill[], theirs: MatchSkill[]) {
  const wanted = mine.filter(s => s.kind === 'learn');
  const offered = mine.filter(s => s.kind === 'teach');
  const learn = wanted.filter(s => theirs.some(t => t.kind === 'teach' && normalize(t.name) === normalize(s.name)));
  const teach = offered.filter(s => theirs.some(t => t.kind === 'learn' && normalize(t.name) === normalize(s.name)));
  const mutual = learn.length > 0 && teach.length > 0;
  const score = mutual ? 80 + Math.round(20 * ((learn.length / Math.max(wanted.length, 1) + teach.length / Math.max(offered.length, 1)) / 2)) : learn.length ? 60 : teach.length ? 40 : 0;
  const reason = mutual ? `Learn ${learn[0]?.name}, share ${teach[0]?.name}. A two-way fit.` : learn.length ? `They can help you learn ${learn[0]?.name}.` : teach.length ? `They want to learn your ${teach[0]?.name} skills.` : 'Discover something new together.';
  return { score, reason };
}