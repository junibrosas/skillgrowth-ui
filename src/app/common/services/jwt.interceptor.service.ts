import { IAuthToken } from './../../dashboard/user/user.types';
import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../dashboard/user/user.types';
import { Router } from '@angular/router';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    public currentUser: IUser;
    public isRefreshingToken = false;
    public tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
        private injector: Injector,
        private router: Router) { }

    /**
     * Set authorization in the Http request header with the access token.
     * @param request Http request
     * @param token access token to append.
     */
    setAuthHeader(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    /**
     * Pull the jwt kind access token from the set of user tokens.
     */
    getTokenData(): IAuthToken {
        if (this.currentUser) {
            const tokenData = this.currentUser.tokens.find(token => token.kind === 'jwt');
            if (tokenData) {
                return tokenData;
            }
        }
    }

    /**
     * Handle 401 Error. The subsequent API calls will wait until the new token has been retrieved. If
     * no new token has been retrieved, current user will be forced to log out.
     * @param request Http request
     * @param next next http response to add into the stream.
     */
    handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (this.isRefreshingToken === false) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

            const http = this.injector.get(HttpClient);

            if (this.getTokenData()) {

                // request for new token using refreshToken
                return http.post('/api/auth/token', { refreshToken: this.getTokenData().refreshToken, email: this.currentUser.email })
                    .pipe(
                        switchMap(
                            (token: string) => {
                                if (token) {
                                    this.tokenSubject.next(token);
                                    return next.handle(this.setAuthHeader(request, token));
                                }
                                console.log('Could not refresh token 1');
                                return this.logout();
                        }),
                        catchError(err => {
                            console.log('Could not refresh token 2');
                            return this.logout(err);
                        }),
                        finalize(() => {
                            this.isRefreshingToken = false;
                        })
                    );
            } else {
                return this.logout();
            }
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.setAuthHeader(request, token));
                })
            );
        }
    }

    /**
     * Logs the user out by navigating back to login page.
     * @param error error object
     */
    logout(error = '') {
        this.router.navigate(['/auth/login']);
        return Observable.throw(error);
    }

    /**
     * This is where the http request intecept happens.
     * @param request Http request
     * @param next next http response to add into the stream.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // add authorization header with jwt token if available
        if (this.getTokenData()) {
            request = this.setAuthHeader(request, this.getTokenData().accessToken);
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 401:
                            return this.handle401Error(request, next);
                        default:
                            return throwError(error);
                    }
                } else {
                    return throwError(error);
                }
            })
        );
    }
}
