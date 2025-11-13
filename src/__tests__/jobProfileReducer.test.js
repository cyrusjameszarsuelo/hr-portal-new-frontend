import { describe, it, expect } from 'vitest';
import { jobProfileReducer, initialJobForm } from '../pages/MyProfile/forms/jobProfileReducer.js';

describe('jobProfileReducer', () => {
  it('INIT merges incoming payload', () => {
    const start = { ...initialJobForm };
    const next = jobProfileReducer(start, { type: 'INIT', payload: { department: 'IT' } });
    expect(next.department).toBe('IT');
  });

  it('UPDATE_FIELD updates nested section', () => {
    const start = { ...initialJobForm };
    const next = jobProfileReducer(start, { type: 'UPDATE_FIELD', payload: { section: 'levelsOfAuthority', field: 'lineAuthority', value: 'High' } });
    expect(next.levelsOfAuthority.lineAuthority).toBe('High');
  });

  it('ADD_KRA adds a new KRA with defaults', () => {
    const start = { ...initialJobForm };
    const next = jobProfileReducer(start, { type: 'ADD_KRA' });
    expect(next.kras).toHaveLength(1);
    expect(next.kras[0].profile_kra).toEqual([]);
  });

  it('REMOVE_KRA removes KRA by index', () => {
    const withKras = jobProfileReducer(initialJobForm, { type: 'ADD_KRA' });
    const next = jobProfileReducer(withKras, { type: 'REMOVE_KRA', index: 0 });
    expect(next.kras).toHaveLength(0);
  });

  it('ADD_PROFILE_KRA and UPDATE_PROFILE_KRA_FIELD work', () => {
    let state = jobProfileReducer(initialJobForm, { type: 'ADD_KRA' });
    state = jobProfileReducer(state, { type: 'ADD_PROFILE_KRA', kraIndex: 0 });
    state = jobProfileReducer(state, { type: 'UPDATE_PROFILE_KRA_FIELD', kraIndex: 0, profileIndex: 0, field: 'description', value: 'Deliver X' });
    expect(state.kras[0].profile_kra[0].description).toBe('Deliver X');
  });
});
