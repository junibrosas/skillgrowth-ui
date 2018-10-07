import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { ModuleService } from './../module.service';
import { COMMON_SET_LISTGRID, COMMON_BREADCRUMB_SET } from './../../common/actions/common.actions';
import { AppState } from './../../common/reducers/index';
import { CourseService } from './../../course/course.service';
import { BreadcrumbsService } from '../../common/components/breadcrumbs/breadcrumbs.service';
import { IListItem } from '../../common/types/common.types';
import { CommandResultService } from './../../common/services/command-result.service';
import { IModule, ModuleStatus } from './../module.types';

@Component({
    selector: 'app-module',
    styles: [],
    template: `<app-content>
        <div class="mb-20">
            <button mat-raised-button [routerLink]="['/module']" [queryParams]="{ courseId: courseId }">
                <mat-icon>add</mat-icon>
                Add New Module
            </button>
        </div>
        <h5>Modules</h5>
        <app-list-grid
            (selectedItem)="onSelectItem($event)"
            (editItem)="onEditItem($event)"
            (deleteItem)="onDeleteItem($event)"></app-list-grid>
    </app-content>`
})

export class ModuleComponent implements OnInit, OnDestroy {
    private courseId: string;
    private destroyed$: Subject<any> = new Subject<any>();
    private breadcrumbsSubscription: Subscription;

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
                        { label: 'Subjects', url: '/subject', params: [] },
                        { label: course.subject.name, url: '/subject/' + course.subject.id, params: [] },
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
        this.router.navigate(['/module', id], { queryParams: { courseId: this.courseId } });
    }

    onEditItem(id: string) {
        this.router.navigate(['/module', id], { queryParams: { courseId: this.courseId } });
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
