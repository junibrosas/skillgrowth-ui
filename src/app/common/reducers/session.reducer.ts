import { IUser } from './../../user/user.types';
import { getDefaultUser } from './../../user/user.reducer';

import {
    SessionActionTypes,
    SESSION_SET_USER
} from '../actions/session.actions';

export interface SessionState {
    user: IUser;
}

export const initialState: SessionState = {
    user: getDefaultUser()
};

export function sessionReducer(state = initialState, action: SessionActionTypes): SessionState {

    switch (action.type) {

        case SESSION_SET_USER:
            return { ...state, user: action.payload };

        default:
            return state;
    }
}
