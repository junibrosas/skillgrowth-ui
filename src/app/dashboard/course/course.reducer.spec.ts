import { CourseState, courseReducer, initialState } from './course.reducer';
import {
    SET_COURSES,
    SET_COURSE,
    RESET_COURSE,
} from './course.actions';

describe('Reducer: CourseReducer', () => {
    const defaultCourse = {
        id: '1',
        name: 'sample',
        description: 'sample',
        subjectId: '2',
        modules: []
    };

    it('should return the default state', () => {
        const action: any = {};
        const state = courseReducer(undefined, action);

        expect(state).toBe(initialState);
    });

    it('should set profile properly', () => {
        const state = courseReducer(undefined, { type: SET_COURSE, payload: defaultCourse });

        expect(state.profile.id).toBe('1');
    });

    it('should set courses properly', () => {
        const state = courseReducer(undefined, { type: SET_COURSES, payload: [defaultCourse, defaultCourse] });

        expect(state.courses.length).toBe(2);
    });

    it('should reset profile properly', () => {
        const state = courseReducer(undefined, { type: RESET_COURSE });

        expect(state.profile.id).toBe('');
    });
});

