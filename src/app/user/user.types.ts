import { IAuthToken } from './user.types';
import { UserTypes } from '../auth/auth.types';

export interface IUser {
    id: string;
    email: string;
    userType: UserTypes;
    password?: string;
    tokens?: IAuthToken[];
    profile: {
        firstname: string;
        lastname: string;
        fullname?: string;
    };
}

export interface IAuthToken {
    accessToken: string;
    kind: string;
    refreshToken: string;
}

export interface IUserProfileDialog {
    user: IUser;
}
