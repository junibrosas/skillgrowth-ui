import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { IUser } from './../../../../user/user.types';
import { AppState } from './../../../reducers/index';
import { USER_ADMIN } from '../../../../auth/auth.constants';

@Component({
    selector: 'app-main-header',
    styles: [],
    templateUrl: './main-header.component.html'
})

export class MainHeaderComponent {
    currentUser: IUser;
    currentUser$: Observable<IUser>;

    constructor(
        private router: Router,
        private store: Store<AppState>
    ) {
        this.currentUser$ = this.store.select(state => state.session.user);
        this.currentUser$.subscribe(user => this.currentUser = user);
    }

    routeToSubjects() {
        this.router.navigate(['/subject']);
    }

    routeToUsers() {
        this.router.navigate(['/user']);
    }

    get fullName() {
        return `${this.currentUser.profile.firstname} ${this.currentUser.profile.lastname}`;
    }

    get isAdministrator() {
        return this.currentUser.userType === USER_ADMIN;
    }
}
