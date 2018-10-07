import { commonReducer, initialState } from './common.reducer';
import {
    COMMON_ENABLE_BUSY,
    COMMON_DISABLE_BUSY,
} from '../actions/common.actions';

describe('Reducer: CommonReducer', () => {
    it('should return the default state', () => {
        const action: any = {};
        const state = commonReducer(undefined, action);

        expect(state).toBe(initialState);
    });

    it('should set isBusy to true', () => {
        const state = commonReducer(undefined, { type: COMMON_ENABLE_BUSY });

        expect(state.isBusy).toBe(true);
    });

    it('should set isBusy to false', () => {
        const state = commonReducer(undefined, { type: COMMON_DISABLE_BUSY });

        expect(state.isBusy).toBe(false);
    });
});

