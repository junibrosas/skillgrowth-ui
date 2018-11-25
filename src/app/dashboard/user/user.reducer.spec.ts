import { UserState, userReducer, initialState } from './user.reducer';
import {
    USER_SET_USERS,
    USER_SET_PROFILE,
    USER_RESET_PROFILE,
} from './user.actions';

describe('Reducer: UserReducer', () => {
    const defaultUser = {
        id: '1',
        profile: {
            firstname: 'John',
            lastname: 'Doe',
        },
        email: 'john@doe.com',
        userType: null
    };

    it('should return the default state', () => {
        const action: any = {};
        const state = userReducer(undefined, action);

        expect(state).toBe(initialState);
    });

    it('should set profile properly', () => {
        const state = userReducer(undefined, { type: USER_SET_PROFILE, payload: defaultUser });

        expect(state.profile.id).toBe('1');
    });

    it('should set users properly', () => {
        const state = userReducer(undefined, { type: USER_SET_USERS, payload: [defaultUser, defaultUser] });

        expect(state.users.length).toBe(2);
    });

    it('should reset profile properly', () => {
        const state = userReducer(undefined, { type: USER_RESET_PROFILE });

        expect(state.profile.id).toBe('');
    });
});

