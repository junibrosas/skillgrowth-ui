import { IUser } from './../../dashboard/user/user.types';
export const SESSION_SET_USER = '[Session]SetUser';

export type SessionActionTypes = { type: '[Session]SetUser', payload: IUser };
