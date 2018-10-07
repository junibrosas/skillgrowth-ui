import { ModuleState, moduleReducer, initialState } from './module.reducer';
import {
    SET_MODULE,
    SET_MODULES,
    RESET_MODULE,
} from './module.action';

describe('Reducer: ModuleReducer', () => {
    const defaultModule = {
        id: '1',
        name: 'sample',
        description: 'sample',
        courseId: '2',
        course: null,
        statusId: 0,
        isCompleted: false,
        author: 'john doe',
        dateCreated: new Date()
    };

    it('should return the default state', () => {
        const action: any = {};
        const state = moduleReducer(undefined, action);

        expect(state).toBe(initialState);
    });

    it('should set profile properly', () => {
        const state = moduleReducer(undefined, { type: SET_MODULE, payload: defaultModule });

        expect(state.profile.id).toEqual('1');
    });

    it('should set modules properly', () => {
        const state = moduleReducer(undefined, { type: SET_MODULES, payload: [defaultModule, defaultModule] });

        expect(state.modules.length).toBe(2);
    });

    it('should reset profile properly', () => {
        const state = moduleReducer(undefined, { type: RESET_MODULE });

        expect(state.profile.id).toBe('');
    });
});

