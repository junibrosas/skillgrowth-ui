import { subjectReducer, initialState } from './subject.reducer';
import {
    SET_SUBJECTS,
    SET_SUBJECT,
    RESET_SUBJECT,
} from './subject.actions';

describe('Reducer: SubjectReducer', () => {
    const defaultSubject = {
        id: 1,
        name: 'sample',
        description: 'sample',
        courses: []
    };

    it('should return the default state', () => {
        const action: any = {};
        const state = subjectReducer(undefined, action);

        expect(state).toBe(initialState);
    });

    it('should set profile properly', () => {
        const state = subjectReducer(undefined, { type: SET_SUBJECT, payload: defaultSubject });

        expect(state.profile.id).toBe(1);
    });

    it('should set subjects properly', () => {
        const state = subjectReducer(undefined, { type: SET_SUBJECTS, payload: [defaultSubject, defaultSubject] });

        expect(state.subjects.length).toBe(2);
    });

    it('should reset profile properly', () => {
        const state = subjectReducer(undefined, { type: RESET_SUBJECT });

        expect(state.profile.id).toBe('');
    });
});

