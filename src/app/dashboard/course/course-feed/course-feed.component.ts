import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommandResultService } from './../../../common/services/command-result.service';
import { IUser } from './../../user/user.types';
import { BreadcrumbsService } from './../../../common/components/breadcrumbs/breadcrumbs.service';
import { AppState } from '../../../common/reducers/index';
import { SET_COURSES, COURSE_USER_SET } from './../course.actions';
import { CourseService } from './../course.service';
import { ICourse, FilterCourse } from './../course.types';
import { EnrollService } from '../../../common/services/enroll.service';

@Component({
    selector: 'app-course-feed',
    styles: [],
    templateUrl: './course-feed.component.html'
})

export class CourseFeedComponent implements OnInit, OnDestroy {
    public currentUserSubscription: Subscription;
    courses$: Observable<ICourse[]>;
    userCourses$: Observable<ICourse[]>;
    currentUser: IUser;

    constructor(
        private store: Store<AppState>,
        private courseService: CourseService,
        private breadcrumbService: BreadcrumbsService,
        private commandResult: CommandResultService,
        private spinner: NgxSpinnerService,
        private enrollService: EnrollService
    ) {
        this.courses$ = this.store.select(state => state.course.courses);
        this.userCourses$ = this.store.select(state => state.course.userCourses);
        this.currentUserSubscription = this.store.select(state => state.session.user).subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.initBreadcrumbs();
        this.getAllCourses();
        this.getEnrolledCourses();
    }

    initBreadcrumbs() {
        this.breadcrumbService.store([
            { label: 'Courses', url: '/dashboard/course/feed', params: [] }
        ]);
    }

    getAllCourses() {
        this.spinner.show();
        this.courseService.getAll().subscribe(
            courses => {
                this.spinner.hide();
                this.store.dispatch({ type: SET_COURSES, payload: courses });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    getEnrolledCourses() {
        this.spinner.show();
        this.enrollService.getEnrolledCoursesByUser(this.currentUser.id).subscribe(
            courses => {
                this.spinner.hide();
                this.store.dispatch({ type: COURSE_USER_SET, payload: courses });
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

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
    }

    onSearchResponse(courses: ICourse[]) {
        this.store.dispatch({ type: SET_COURSES, payload: courses });
    }

    onFilterChange(filterBy: FilterCourse) {
        switch (filterBy) {

            case FilterCourse.All:
                this.getAllCourses();
                break;

            case FilterCourse.Enrolled:
                this.spinner.show();
                this.enrollService.getEnrolledCoursesByUser(this.currentUser.id).subscribe(
                    courses => {
                        this.spinner.hide();
                        this.store.dispatch({
                            type: SET_COURSES, payload: courses.map(course => {
                                return { ...course, isEnrolled: true };
                            })
                        });
                    },
                    error => {
                        this.spinner.hide();
                        this.commandResult.error(error);
                    }
                );
                break;

            default:
                break;
        }
    }
}
