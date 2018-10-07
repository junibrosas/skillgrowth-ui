import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { USER_CONTRIBUTOR, USER_ADMIN } from './auth.constants';
import { IUser } from './../user/user.types';

@Injectable()
export class AuthContributorGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        const user: IUser = JSON.parse(localStorage.getItem('currentUser'));

        if (user && user.userType === USER_CONTRIBUTOR || user.userType === USER_ADMIN) {
            return true;
        }

        this.router.navigate(['/auth/login']);

        return false;
    }
}

