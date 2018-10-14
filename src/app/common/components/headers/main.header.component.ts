import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { IUser } from './../../../user/user.types';
import { AppState } from './../../reducers/index';
import { USER_ADMIN } from '../../../auth/auth.constants';

@Component({
    selector: 'app-main-header',
    styles: [],
    template: `<div class="container">
        <mat-toolbar class="no-bg-color top-nav">
            <mat-toolbar-row>
                <span class="company-name">E-learning Platform</span>
                <div *ngIf="isAdministrator">
                    <button (click)="routeToSubjects()" mat-icon-button><mat-icon>library_books</mat-icon></button>
                    <button (click)="routeToUsers()" mat-icon-button><mat-icon>group</mat-icon></button>
                </div>
                <span class="example-spacer"></span>
                <div class="top-nav-user">
                    <div class="top-nav-user-name">{{ fullName }}</div>
                    <div class="top-nav-user-type">{{ currentUser.userType }}</div>
                </div>
                <div mat-card-avatar class="example-header-image"></div>
                <mat-menu #userMenu="matMenu">
                    <button [routerLink]="'/user/'+currentUser.id" mat-menu-item>Profile</button>
                    <button [routerLink]="'/auth/login'" mat-menu-item>Logout</button>
                </mat-menu>
                <button mat-icon-button [matMenuTriggerFor]="userMenu">
                    <mat-icon>keyboard_arrow_down</mat-icon>
                </button>
            </mat-toolbar-row>
        </mat-toolbar>
        <div *ngIf="!currentUser.active" class="alert alert-warning">
            Please check your email address for your account activation code. Activate your account within an hour upon your registration.
        </div>
    </div>`
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
