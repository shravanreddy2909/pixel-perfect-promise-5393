import { describe, expect, it } from 'vitest';
import { matchStudents } from '@/lib/matching';
describe('mutual skill matching', () => {
  const mine = [{ name: 'Python', kind: 'teach' }, { name: 'Guitar', kind: 'learn' }];
  it('ranks mutual fit above a one-way match', () => {
    const mutual = matchStudents(mine, [{ name: 'guitar', kind: 'teach' }, { name: 'python', kind: 'learn' }]);
    const oneWay = matchStudents(mine, [{ name: 'Guitar', kind: 'teach' }]);
    expect(mutual.score).toBe(100);
    expect(oneWay.score).toBe(60);
    expect(mutual.score).toBeGreaterThan(oneWay.score);
  });
  it('does not claim a match for unrelated skills', () => {
    expect(matchStudents(mine, [{ name: 'Chess', kind: 'teach' }]).score).toBe(0);
  });
});