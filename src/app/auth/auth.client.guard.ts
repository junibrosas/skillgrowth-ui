import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { IUser } from './../dashboard/user/user.types';
import { USER_LEARNER } from './auth.constants';

@Injectable()
export class AuthClientGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        const user: IUser = JSON.parse(localStorage.getItem('currentUser'));

        if (user && user.userType === USER_LEARNER) {
            return true;
        }

        this.router.navigate(['/auth/login']);
        return false;
    }
}

