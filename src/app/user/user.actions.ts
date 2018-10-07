import { IUser } from './user.types';

export const USER_SET_USERS = '[User]SetUsers';
export const USER_SET_PROFILE = '[User]SetProfile';
export const USER_RESET_PROFILE = '[User]ResetProfile';
export const USER_UPDATE = '[User]UpdateUser';

export type UserActionsTypes =
    { type: '[User]SetUsers', payload: IUser[] } |
    { type: '[User]SetProfile', payload: IUser } |
    { type: '[User]UpdateUser', payload: IUser } |
    { type: '[User]ResetProfile' };
