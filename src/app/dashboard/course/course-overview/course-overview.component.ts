import { EnrollService } from './../../../common/services/enroll.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { AppState } from '../../../common/reducers/index';
import { SET_COURSE } from './../course.actions';
import { ICourse } from './../course.types';
import { IModule } from './../../module/module.types';
import { BreadcrumbsService } from '../../../common/components/breadcrumbs/breadcrumbs.service';
import { COMMON_BREADCRUMB_SET } from '../../../common/actions/common.actions';
import { CommandResultService } from './../../../common/services/command-result.service';
import { IUser } from './../../user/user.types';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-course-overview',
    styles: [],
    templateUrl: './course-overview.component.html'
})

export class CourseOverviewComponent implements OnInit, OnDestroy {
    public courseId: string;
    public breadcrumbsSubscription: Subscription;
    public currentUserSubscription: Subscription;
    public isEnrolled = false;
    public dataSource = new MatTableDataSource([]);
    course$: Observable<ICourse>;
    displayedColumns = ['icon', 'name', 'author', 'date'];
    currentUser: IUser;

    constructor(
        private store: Store<AppState>,
        private breadcrumbService: BreadcrumbsService,
        private commandResult: CommandResultService,
        private route: ActivatedRoute,
        public router: Router,
        private spinner: NgxSpinnerService,
        private enrollService: EnrollService
    ) {
        this.course$ = this.store.select(state => state.course.profile);

        this.breadcrumbsSubscription = this.store.select(state => state.common.breadcrumbs).subscribe(breadcrumbs => {
            this.breadcrumbService.store(breadcrumbs);
        });

        this.currentUserSubscription = this.store.select(state => state.session.user).subscribe(user => {
            this.currentUser = user;
        });

        this.route.paramMap.subscribe(pmap => {
            this.courseId = pmap.get('id');
        });
    }

    ngOnInit() {
        this.getCourse();
    }

    ngOnDestroy() {
        this.breadcrumbsSubscription.unsubscribe();
        this.currentUserSubscription.unsubscribe();
    }

    getCourse() {
        this.spinner.show();
        this.enrollService.getByIdAndPublished(this.courseId, this.currentUser.id).subscribe(
            payload => {
                this.spinner.hide();
                this.store.dispatch({
                    type: COMMON_BREADCRUMB_SET, payload: [
                        { label: 'Courses', url: '/dashboard/course/feed', params: [] },
                        { label: payload.course.name, url: '/dashboard/course/detail/' + payload.course.id, params: [] }
                    ]
                });
                this.store.dispatch({ type: SET_COURSE, payload: payload.course });
                this.dataSource = new MatTableDataSource(payload.course.modules);
                this.isEnrolled = payload.isEnrolled;
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    enrollCourse(courseId: string) {
        this.spinner.show();
        this.enrollService.enrollCourseByUser(this.currentUser.id, courseId).subscribe(
            payload => {
                this.spinner.hide();
                this.isEnrolled = true;
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    trackByFn(index, item) {
        return index;
    }

    viewModule(module: IModule) {
        if (this.isEnrolled) {
            this.router.navigate(['/dashboard/module/detail/', module.id]);
        }
    }

    imageThumbnail(course: ICourse) {
        return course.thumbnail ? course.thumbnail : '../../../assets/images/placeholder.jpg';
    }
}
