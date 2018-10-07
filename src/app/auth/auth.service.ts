import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { RequestBase } from '../common/services/request-base';
import { IUser } from './../user/user.types';
import { ILoginForm, IResetTokenPayload, IActivateUserPayload } from './auth.types';
import { environment } from '../../environments/environment';

const AUTH_TOKEN = 'token';
const CURRENT_USER = 'currentUser';

@Injectable()
export class AuthService extends RequestBase {
    private apiUrl = `${environment.apiUrl}/auth/`;

    constructor(
        public http: HttpClient,

    ) {
        super(http);
    }

    /**
     * Login successfully if there's a jwt token in the response.
     * Store user details and jwt token in local storage to keep user logged in between page refreshes.
     * @param credentials The email and password data
     */
    loginUser(credentials: ILoginForm) {
        return this.http.post<IUser>(this.apiUrl + '/login', credentials)
            .pipe(map(user => {
                if (user) {
                    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
                }
                return user;
            }));
    }

    registerUser(user: IUser) {
        return this.http.post<IUser>(this.apiUrl + '/register', user);
    }

    activateUser(token: string) {
        return this.http.get<IActivateUserPayload>(this.apiUrl + '/activate/' + token);
    }

    /**
     * Submit the email to request for token.
     * @param email Specified user email address.
     */
    recoverPassword(email: string) {
        return this.http.post(this.apiUrl + '/forgot', { email });
    }

    /**
     * Check if reset token is expired.
     * @param token specified reset token.
     */
    checkResetToken(token: string) {
        return this.http.get<IResetTokenPayload>(this.apiUrl + '/reset/' + token);
    }

    /**
     * Request to reset the password.
     * @param token password reset token
     * @param password user new password
     * @param confirm user confirmation password
     */
    resetPassword(token: string, password: string, confirm: string ) {
        return this.http.post(this.apiUrl + '/reset/' + token, { password, confirm_password: confirm });
    }

    /**
     * Remove the user from local storage to log user out
     */
    logout() {
        localStorage.removeItem('currentUser');
        this.http.get(this.apiUrl + '/logout').subscribe();
    }
}
