import { describe, it, expect } from 'vitest';
import { aboutFormReducer, initialAboutForm } from '../pages/MyProfile/forms/aboutFormReducer.js';

describe('aboutFormReducer', () => {
  it('initializes with profileId', () => {
    const state = initialAboutForm(123);
    expect(state.org_structure_id).toBe(123);
    expect(state.interests).toEqual([]);
  });

  it('APPLY_UPDATER updates top-level field', () => {
    const start = initialAboutForm(1);
    const next = aboutFormReducer(start, { type: 'APPLY_UPDATER', updater: (s) => ({ ...s, employee_id: 'EMP001' }) });
    expect(next.employee_id).toBe('EMP001');
    // immutability
    expect(start.employee_id).toBe('');
  });

  it('REPLACE merges payload', () => {
    const start = initialAboutForm(5);
    const payload = { nickname: 'Jay', interests: [{ interest: 'Reading' }] };
    const next = aboutFormReducer(start, { type: 'REPLACE', payload });
    expect(next.nickname).toBe('Jay');
    expect(next.interests).toHaveLength(1);
  });
});
