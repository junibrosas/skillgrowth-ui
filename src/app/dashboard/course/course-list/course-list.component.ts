import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { SET_COURSE, RESET_COURSE } from '../course.actions';
import { CourseService } from '../course.service';
import { COMMON_SET_LISTGRID, COMMON_BREADCRUMB_SET } from '../../../common/actions/common.actions';
import { SubjectService } from '../../subject/subject.service';
import { AppState } from '../../../common/reducers';
import { ICourse } from '../course.types';
import { ISubject } from '../../subject/subject.types';
import { BreadcrumbsService } from '../../../common/components/breadcrumbs/breadcrumbs.service';
import { IListItem } from '../../../common/types/common.types';
import { CommandResultService } from '../../../common/services/command-result.service';

@Component({
    selector: 'app-course-list',
    styles: [],
    templateUrl: './course-list.component.html'
})

export class CourseListComponent implements OnInit, OnDestroy {
    public breadcrumbsSubscription: Subscription;
    public subjectId: string;
    public subject: ISubject;
    course$: Observable<ICourse>;

    constructor(
        private breadcrumbService: BreadcrumbsService,
        private subjectService: SubjectService,
        private courseService: CourseService,
        private route: ActivatedRoute,
        private router: Router,
        private commandResult: CommandResultService,
        private store: Store<AppState>,
        private spinner: NgxSpinnerService,
    ) {
        this.course$ = this.store.select(state => state.course.profile);

        this.breadcrumbsSubscription = this.store.select(state => state.common.breadcrumbs).subscribe(breadcrumbs => {
            this.breadcrumbService.store(breadcrumbs);
        });

        this.route.paramMap.subscribe(pmap => {
            this.subjectId = pmap.get('id');
        });
    }

    ngOnInit() {
        console.warn('haha');
        if (this.subjectId) {
            this.getSubject();
        }
    }

    ngOnDestroy() {
        this.store.dispatch({ type: RESET_COURSE });
        this.breadcrumbsSubscription.unsubscribe();
    }

    getSubject() {
        this.spinner.show();

        this.subjectService.getById(this.subjectId).subscribe(
            subject => {
                this.spinner.hide();
                this.subject = subject;
                this.store.dispatch({ type: COMMON_SET_LISTGRID, payload: this.toList(subject.courses) });
                this.store.dispatch({
                    type: COMMON_BREADCRUMB_SET, payload: [
                        { label: 'Subjects', url: '/dashboard/subject', params: [] },
                        { label: subject.name, url: '/dashboard//subject/' + subject.id, params: [] }
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
        this.router.navigate(['/dashboard/course/', id]);
    }

    onEditItem(id: string) {
        const course = this.subject.courses.find(c => c.id === id);
        this.store.dispatch({ type: SET_COURSE, payload: course });
    }

    onDeleteItem(id: string) {
        this.spinner.show();

        this.courseService.delete(id).subscribe(
            payload => {
                this.spinner.hide();
                this.getSubject();
                this.commandResult.promptDeleted();
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onSubmitted(course: ICourse) {
        this.onSuccess();
    }

    onReset() {
        this.store.dispatch({ type: RESET_COURSE });
    }

    onSuccess() {
        this.getSubject();
        this.commandResult.promptSaved();
        this.store.dispatch({ type: RESET_COURSE });
    }

    private toList(records: ICourse[]): IListItem[] {
        return records.map(r => {
            if (r.modules) {
                return { ...r, description: `${r.modules.length} ${r.modules.length > 1 ? 'Modules' : 'Module'}` };
            } else {
                return r;
            }
        });
    }
}
