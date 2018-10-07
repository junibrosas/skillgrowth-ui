import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { SESSION_SET_USER } from './../actions/session.actions';
import { AppState } from './../reducers/index';
import { IUser } from '../../user/user.types';

@Component({
    selector: 'app-admin',
    styles: [],
    template: `<div class="layout">
        <ngx-spinner
        bdOpacity = 0.7
        bdColor = "#e7cccc"
        size = "medium"
        color = "#181818"
        type = "ball-climbing-dot"
        ></ngx-spinner>
        <app-main-header></app-main-header>
        <div class="main-content">
            <router-outlet></router-outlet>
        </div>
        <main-footer-component></main-footer-component>
    </div>`
})

export class LayoutAdminComponent {
    constructor(
        private store: Store<AppState>
    ) {
        const user: IUser = JSON.parse(localStorage.getItem('currentUser'));
        this.store.dispatch({ type: SESSION_SET_USER, payload: user });
    }
}
