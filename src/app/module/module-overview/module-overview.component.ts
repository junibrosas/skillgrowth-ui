import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { AppState } from '../../common/reducers/index';
import { IModule } from './../module.types';
import { ModuleService } from '../module.service';
import { SET_MODULE, RESET_MODULE } from './../module.action';
import { COMMON_BREADCRUMB_SET } from '../../common/actions/common.actions';
import { CommandResultService } from './../../common/services/command-result.service';
import { IUser } from './../../user/user.types';
import { BreadcrumbsService } from './../../common/components/breadcrumbs/breadcrumbs.service';

@Component({
    selector: 'app-module-overview',
    templateUrl: './module-overview.component.html'
})

export class ModuleOverviewComponent implements OnDestroy, OnInit {
    module$: Observable<IModule>;
    moduleId: string;
    courseId: string;
    currentUser: IUser;
    currentUserSubscription: Subscription;
    breadcrumbsSubscription: Subscription;
    isCompleted: boolean;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router,
        private service: ModuleService,
        private commandResult: CommandResultService,
        private breadcrumbService: BreadcrumbsService,
        private spinner: NgxSpinnerService,
    ) {
        this.module$ = this.store.select(state => state.module.profile);

        this.breadcrumbsSubscription = this.store.select(state => state.common.breadcrumbs).subscribe(breadcrumbs => {
            this.breadcrumbService.store(breadcrumbs);
        });

        this.currentUserSubscription = this.store.select(state => state.session.user).subscribe(user => {
            this.currentUser = user;
        });

        this.moduleId = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.getModule();
    }

    getModule() {
        this.spinner.show();

        this.service.getByUserOwned(this.moduleId, this.currentUser.id).subscribe(
            payload => {
                this.spinner.hide();
                this.courseId = payload.module.course.id.toString();
                this.isCompleted = payload.isCompleted;
                this.store.dispatch({
                    type: COMMON_BREADCRUMB_SET, payload: [
                        { label: 'Courses', url: '/course/feed', params: [] },
                        { label: payload.module.course.name, url: '/course/detail/' + payload.module.course.id, params: [] },
                        { label: payload.module.name, url: '/module/detail/' + payload.module.id, params: [] }
                    ]
                });
                this.store.dispatch({ type: SET_MODULE, payload: payload.module });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    ngOnDestroy() {
        this.store.dispatch({ type: RESET_MODULE });
        this.currentUserSubscription.unsubscribe();
        this.breadcrumbsSubscription.unsubscribe();
    }

    markAsComplete(isComplete: boolean) {
        this.spinner.show();

        this.service.markAsComplete(this.moduleId, this.courseId, this.currentUser.id, isComplete).subscribe(
            () => {
                this.spinner.hide();
                this.commandResult.promptSaved();
                this.isCompleted = !this.isCompleted;
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }
}
