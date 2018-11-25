import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { IUser } from './../dashboard/user/user.types';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        const user: IUser = JSON.parse(localStorage.getItem('currentUser'));

        if (user) {
            return true;
        }

        this.router.navigate(['/auth/login']);
        return false;
    }
}

