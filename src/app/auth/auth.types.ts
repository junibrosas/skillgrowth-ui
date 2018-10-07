export interface ILoginForm {
    email: string;
    password: string;
}

export interface IRegisteForm {
    id: string;
    email: string;
    userType: UserTypes;
    password: string;
    confirmPassword: string;
    isAgreeTerms: boolean;
    firstname: 'john';
    lastname: 'doe';
}

export interface IResetTokenPayload {
    isAuthenticated: boolean;
    isInvalid: boolean;
    message: string;
}

export interface IActivateUserPayload {
    isValid: boolean;
    message: string;
}

export type UserTypes = 'Contributor' | 'Learner' | 'Administrator';
