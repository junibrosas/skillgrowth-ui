import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { COMMON_BREADCRUMB_SET, COMMON_SET_LISTGRID } from './../../common/actions/common.actions';
import { AppState } from '../../common/reducers/index';
import { BreadcrumbsService } from './../../common/components/breadcrumbs/breadcrumbs.service';
import { SubjectService } from '../subject.service';
import { CommandResultService } from './../../common/services/command-result.service';
import { IUser } from './../../user/user.types';
import {
    SET_SUBJECT,
    RESET_SUBJECT } from './../subject.actions';

@Component({
    selector: 'app-subject',
    styles: [],
    template: `<app-content>
        <app-subject-profile
            [user]="user"
            (submitted)="getSubjects($event)"></app-subject-profile>
        <h5>Subjects</h5>
        <app-list-grid
            (selectedItem)="onSelectItem($event)"
            (editItem)="onEditItem($event)"
            (deleteItem)="onDeleteItem($event)"></app-list-grid>
    </app-content>`
})

export class SubjectComponent implements OnInit, OnDestroy {
    breadcrumbsSub: Subscription;
    user: IUser;
    userSub: Subscription;

    constructor(
        private store: Store<AppState>,
        private subjectService: SubjectService,
        private breadcrumbService: BreadcrumbsService,
        private commandResult: CommandResultService,
        private router: Router,
        private spinner: NgxSpinnerService,
    ) {
        this.breadcrumbsSub = this.store.select(state => state.common.breadcrumbs).subscribe(breadcrumbs => {
            this.breadcrumbService.store(breadcrumbs);
        });

        this.userSub = this.store.select(state => state.session.user).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.getSubjects();
        this.initBreadcrumbs();
    }

    ngOnDestroy() {
        this.store.dispatch({ type: RESET_SUBJECT });
        this.userSub.unsubscribe();
        this.breadcrumbsSub.unsubscribe();
    }

    initBreadcrumbs() {
        this.store.dispatch({
            type: COMMON_BREADCRUMB_SET, payload: [
                { label: 'Subjects', url: '/subject', params: [] },
                { label: 'Add New Subject', url: '', params: [] }
            ]
        });
    }

    onSelectItem(id: number) {
        this.router.navigate(['/subject/', id]);
    }

    onEditItem(id: string) {
        this.spinner.show();
        this.subjectService.getById(id).subscribe(
            subject => {
                this.spinner.hide();
                this.store.dispatch({ type: SET_SUBJECT, payload: subject });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onDeleteItem(id: number) {
        this.spinner.show();
        this.subjectService.delete(id).subscribe(
            payload => {
                this.spinner.hide();
                this.commandResult.promptDeleted();
                this.getSubjects();
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    getSubjects($event?: any) {
        this.spinner.show();
        this.subjectService.getByUser(this.user.id).subscribe(
            subjects => {
                this.spinner.hide();
                this.store.dispatch({ type: COMMON_SET_LISTGRID, payload: subjects });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }
}
