import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { AppState } from '../../reducers/index';
import { IUser } from '../../../user/user.types';
import { Subject, Observable } from 'rxjs';
import { USER_CONTRIBUTOR, USER_LEARNER } from '../../../auth/auth.constants';
import { UserTypes } from './../../../auth/auth.types';
import { IMenuItem } from './../../types/common.types';

@Component({
    selector: 'app-main-sidebar',
    styles: [],
    template: `<aside class="sidebar">
    <div class="sidebar-container">
        <div class="sidebar-header">
            <div class="brand">
                <div class="logo">
                    <span class="l l1"></span>
                    <span class="l l2"></span>
                    <span class="l l3"></span>
                    <span class="l l4"></span>
                    <span class="l l5"></span>
                </div> Modular Admin </div>
        </div>
        <nav class="menu">
            <ul class="sidebar-menu metismenu" id="sidebar-menu">
                <li *ngFor="let item of menuItems; trackBy: trackByFn; let i = index;"
                (click)="changeParentIndex(i)" [class]="activeParentIndex === i ? 'active open' : null">
                    <a [routerLink]="item.link">
                        <i [class]="item.icon"></i> {{item.label}}
                        <i *ngIf="item.children.length > 0" class="fa arrow"></i>
                    </a>
                    <ul *ngIf="item.children.length > 0" class="sidebar-nav">
                        <li *ngFor="let child of item.children; trackBy: trackByFn; let j = index"
                        (click)="changeChildIndex(j)" [class.active]="activeChildIndex === j">
                            <a [routerLink]="child.link"> {{child.label}} </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
</aside>`
})

export class MainSidebarComponent implements OnInit {
    segment: string;
    parentIndex: number;
    activeChildIndex: number;
    menuItems: IMenuItem[];
    user$: Observable<IUser>;
    user: IUser;
    destroyed$: Subject<any> = new Subject<any>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>
    ) {
        this.user$ = this.store.select(state => state.session.user);
        this.user$.subscribe(user => this.user = user);

        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.route)
        ).subscribe((event) => {
                const segments = this.router.url.split('/');
                this.segment = segments[1] ? segments[1] : '';
            });

        this.menuItems = this.getMenuItems(this.user.userType);
    }

    ngOnInit() {
        const indexOf = this.menuItems.findIndex(item => item.link.split('/')[1] === this.segment);
        if (indexOf !== -1) {
            this.parentIndex = indexOf;
        }
    }

    trackByFn(index, item) {
        return index;
    }

    changeParentIndex(i) {
        this.parentIndex = i;
    }

    changeChildIndex(i) {
        this.activeChildIndex = i;
    }

    private getMenuItems(type: UserTypes): IMenuItem[] {
        switch (type) {
            case USER_CONTRIBUTOR:
                return [
                    {
                        label: 'Module Manager', icon: 'fa fa-th-large', link: '/module', children: [
                            { label: 'Courses', icon: '', link: '/course', children: [] },
                            { label: 'Subjects', icon: '', link: '/subject', children: [] }
                        ]
                    },
                    { label: 'Users', icon: 'fa fa-user', link: '/user', children: [] }
                ];

            case USER_LEARNER:
                return [
                    { label: 'Courses', icon: 'fa fa-book', link: '/course/feed', children: [] }
                ];

            default:
                return [];
        }
    }

    get activeParentIndex() {
        return this.parentIndex;
    }
}
