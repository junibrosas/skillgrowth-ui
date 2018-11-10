import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommandResultService } from './../../common/services/command-result.service';
import { IUser } from './../../user/user.types';
import { BreadcrumbsService } from './../../common/components/breadcrumbs/breadcrumbs.service';
import { AppState } from '../../common/reducers/index';
import { SET_COURSES, COURSE_USER_SET } from './../course.actions';
import { CourseService } from './../course.service';
import { ICourse, FilterCourse } from './../course.types';
import { EnrollService } from '../../common/services/enroll.service';

@Component({
    selector: 'app-course-feed',
    styles: [],
    template: `<app-content>
        <div class="lesson-resume mb-40" *ngIf="false">
            <span class="subtitle">Resume your current lesson</span>
            <h5 class="title">
                Angular 5:
                <span>Changing Pages with Routing</span>
            </h5>
        </div>
        <div class="section" *ngIf="userCourses$ | async as userCourses">
            <h5>Your Courses</h5>
            <app-course-feed-list [courses]="userCourses">
            </app-course-feed-list>
        </div>
        <div class="section" *ngIf="courses$ | async as courses">
            <div class="row">
                <div class="col-md-6">
                    <h5>All Courses</h5>
                </div>
                <div class="col-md-3">
                    <app-course-search (whenTypeAhead)="onSearchResponse($event)">
                    </app-course-search>
                </div>
                <div class="col-md-3">
                    <course-filter (selected)="onFilterChange($event)">
                    </course-filter>
                </div>
            </div>
            <app-course-feed-list [courses]="courses">
            </app-course-feed-list>
        </div>
    </app-content>`
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
            { label: 'Courses', url: '/course/feed', params: [] }
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
