import { Router } from '@angular/router';
import { ICourse } from './../course.types';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-course-feed-list',
    styles: [],
    template: `<div class="row mt-20">
        <div *ngFor="let course of courses; trackBy: trackByFn; index as i" class="col-md-3">
            <mat-card class="clickable list-item" [id]="'list-item-'+i" (click)="gotoCourse(course)">
                <div>
                    <div [ngStyle]="{'background-image': 'url('+imageThumbnail(course)+')'}" class="card-image-bg"></div>
                    <div *ngIf="course.isEnrolled" class="mat-card-pin">Enrolled</div>
                </div>
                <mat-card-content>
                    <span class="small" *ngIf="course.subject">{{course.subject.name}}</span>
                    <h5>{{course.name}}</h5>
                </mat-card-content>
            </mat-card>
        </div>
        <div class="col-md-12">
            <div *ngIf="courses.length <= 0" class="alert alert-info">
                No records available.
            </div>
        </div>
    </div>`
})

export class CourseFeedListComponent {
    @Input() courses: ICourse[];

    constructor(
        private router: Router
    ) { }

    gotoCourse(course: ICourse) {
        this.router.navigateByUrl(`/course/detail/${course.id}`);
    }

    trackByFn(index, item) {
        return index;
    }

    public imageThumbnail(course: ICourse) {
        return course.thumbnail ? course.thumbnail : '../../../assets/images/placeholder.jpg';
    }
}
