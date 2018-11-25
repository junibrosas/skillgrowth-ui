/* tslint:disable: no-switch-case-fall-through */
import { IUser } from './user.types';
import {
    USER_SET_USERS,
    USER_SET_PROFILE,
    USER_RESET_PROFILE,
    USER_UPDATE,
    UserActionsTypes,
} from './user.actions';

export interface UserState {
    users: IUser[];
    profile: IUser;
}

export const getDefaultUser = (): IUser => {
    return {
        id: '',
        userType: null,
        email: '',
        profile: {
            firstname: '',
            lastname: ''
        }
    };
};

export const initialState: UserState = {
    users: [],
    profile: getDefaultUser()
};

export function userReducer(state = initialState, action: UserActionsTypes): UserState {
    switch (action.type) {

        case USER_SET_USERS: {
            return { ...state, users: action.payload };
        }

        case USER_SET_PROFILE: {
            return { ...state, profile: action.payload };
        }

        case USER_RESET_PROFILE: {
            return { ...state, profile: getDefaultUser() };
        }

        case USER_UPDATE:
            const users = state.users.map((item, index) => {
                if (item.id !== action.payload.id) {
                    return item;
                }
                return { ...item, ...action.payload };
            });
            return { ...state, users };

        default: {
            return state;
        }
    }
}

