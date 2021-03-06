import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { ModuleService } from './../module.service';
import { COMMON_SET_LISTGRID, COMMON_BREADCRUMB_SET } from './../../../common/actions/common.actions';
import { AppState } from './../../../common/reducers/index';
import { CourseService } from './../../course/course.service';
import { BreadcrumbsService } from '../../../common/components/breadcrumbs/breadcrumbs.service';
import { IListItem } from '../../../common/types/common.types';
import { CommandResultService } from './../../../common/services/command-result.service';
import { IModule, ModuleStatus } from './../module.types';

@Component({
    selector: 'app-module',
    templateUrl: './module-list.component.html'
})

export class ModuleListComponent implements OnInit, OnDestroy {
    courseId: string;
    destroyed$: Subject<any> = new Subject<any>();
    breadcrumbsSubscription: Subscription;

    constructor(
        private courseService: CourseService,
        private moduleService: ModuleService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private commandResult: CommandResultService,
        private breadcrumbService: BreadcrumbsService,
        private spinner: NgxSpinnerService,
    ) {
        this.breadcrumbsSubscription = this.store.select(state => state.common.breadcrumbs).subscribe(breadcrumbs => {
            this.breadcrumbService.store(breadcrumbs);
        });

        this.courseId = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.getCourse();
    }

    ngOnDestroy() {
        this.breadcrumbsSubscription.unsubscribe();
    }

    getCourse() {
        this.spinner.show();

        this.courseService.getById(this.courseId).subscribe(
            course => {
                this.spinner.hide();
                this.store.dispatch({ type: COMMON_SET_LISTGRID, payload: this.toList(course.modules) });
                this.store.dispatch({
                    type: COMMON_BREADCRUMB_SET, payload: [
                        { label: 'Subjects', url: '/dashboard/subject', params: [] },
                        { label: course.subject.name, url: '/dashboard/subject/' + course.subject.id, params: [] },
                        { label: course.name, url: '', params: [] }
                    ]
                });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onSelectItem(id: string) {
        this.router.navigate(['/dashboard/module', id], { queryParams: { courseId: this.courseId } });
    }

    onEditItem(id: string) {
        this.router.navigate(['/dashboard/module', id], { queryParams: { courseId: this.courseId } });
    }

    onDeleteItem(id: string) {
        this.spinner.show();

        this.moduleService.delete(id).subscribe(
            payload => {
                this.spinner.hide();
                this.getCourse();
                this.commandResult.promptDeleted();
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    private toList(records: IModule[]): IListItem[] {
        return records.map(r => {
            return { ...r, description: r.statusId === ModuleStatus.Draft ? 'draft' : 'published' };
        });
    }
}
