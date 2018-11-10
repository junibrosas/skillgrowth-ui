import { EnrollService } from './../../common/services/enroll.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { AppState } from '../../common/reducers/index';
import { SET_COURSE } from './../course.actions';
import { ICourse } from './../course.types';
import { IModule } from './../../module/module.types';
import { BreadcrumbsService } from '../../common/components/breadcrumbs/breadcrumbs.service';
import { COMMON_BREADCRUMB_SET } from '../../common/actions/common.actions';
import { CommandResultService } from './../../common/services/command-result.service';
import { IUser } from './../../user/user.types';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-course-overview',
    styles: [],
    template: `<app-content *ngIf="course$ | async as course">
    <h3 class="mb-20">{{course.name}}</h3>
    <div class="row">
        <div class="col-md-3">
            <mat-card class="example-card no-content clickable mb-20">
                <div [ngStyle]="{'background-image': 'url('+imageThumbnail(course)+')'}" class="card-image-bg"></div>
            </mat-card>
            <button mat-raised-button color="primary"
                (click)="enrollCourse(course.id)"
                [disabled]="isEnrolled">Enroll</button>
            <p *ngIf="isEnrolled" class="text-muted mt-20">You are currently enrolled in this course.</p>
            <p *ngIf="!isEnrolled" class="text-muted mt-20">You must enroll this course to view the modules.</p>
        </div>
        <div class="col-md-9">
            <h5>Course Modules</h5>
            <div *ngIf="course.modules.length <= 0" class="alert alert-info">
                No records available.
            </div>
            <div class="data-table">
                <mat-table #table [dataSource]="dataSource">
                    <ng-container matColumnDef="icon">
                        <mat-header-cell *matHeaderCellDef> </mat-header-cell>
                        <mat-cell *matCellDef="let element" class="row-icon">
                            <mat-icon *ngIf="element.isCompleted">check</mat-icon>
                            <mat-icon *ngIf="!element.isCompleted">keyboard_arrow_right</mat-icon>
                        </mat-cell>
                    </ng-container>

                    <ng-container matColumnDef="name">
                        <mat-header-cell *matHeaderCellDef> </mat-header-cell>
                        <mat-cell *matCellDef="let element"> {{element.name}} </mat-cell>
                    </ng-container>

                    <ng-container matColumnDef="author">
                        <mat-header-cell *matHeaderCellDef>  </mat-header-cell>
                        <mat-cell *matCellDef="let element" class="text-right"> {{element.author}} </mat-cell>
                    </ng-container>

                    <ng-container matColumnDef="date">
                        <mat-header-cell *matHeaderCellDef>  </mat-header-cell>
                        <mat-cell *matCellDef="let element" class="text-right"> {{element.dateCreated | date}} </mat-cell>
                    </ng-container>

                    <mat-header-row *matHeaderRowDef="displayedColumns" [hidden]="true"></mat-header-row>
                    <mat-row *matRowDef="let row; columns: displayedColumns;" (click)="viewModule(row)"></mat-row>
                </mat-table>
            </div>
        </div>
    </div>
    </app-content>`
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
                        { label: 'Courses', url: '/course/feed', params: [] },
                        { label: payload.course.name, url: '/course/detail/' + payload.course.id, params: [] }
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
            this.router.navigate(['/module/detail/', module.id]);
        }
    }

    imageThumbnail(course: ICourse) {
        return course.thumbnail ? course.thumbnail : '../../../assets/images/placeholder.jpg';
    }
}
