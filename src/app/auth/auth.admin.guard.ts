import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { USER_ADMIN } from './auth.constants';
import { IUser } from './../dashboard/user/user.types';

@Injectable()
export class AuthAdminGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        const user: IUser = JSON.parse(localStorage.getItem('currentUser'));

        if (user && user.userType === USER_ADMIN) {
            return true;
        }

        this.router.navigate(['/auth/login']);

        return false;
    }
}

