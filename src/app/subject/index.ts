import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '../common/index';
import { subjectReducer } from './subject.reducer';
import { SubjectProfileComponent } from './containers/subject-profile.container';
import { SubjectComponent } from './containers/subject.container';
import { CourseComponent } from '../course/containers/course.container';
import { CourseService } from './../course/course.service';
import { SubjectService } from './subject.service';
import { CourseFormComponent } from '../course/components/course-form.component';
import { BreadcrumbsService } from '../common/components/breadcrumbs/breadcrumbs.service';
import { AuthContributorGuard } from './../auth/auth.contributor.guard';
import { NotFound404Component } from './../not-found404.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthContributorGuard],
        component: SubjectComponent
    },
    {
        path: ':id',
        canActivate: [AuthContributorGuard],
        component: CourseComponent
    },
    {
        path: '**',
        component: NotFound404Component
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('subject', subjectReducer),

        MatFormFieldModule,
        MatInputModule,
    ],
    exports: [],
    declarations: [
        SubjectComponent,
        SubjectProfileComponent,
        CourseComponent,
        CourseFormComponent
    ],
    providers: [
        SubjectService,
        CourseService,
        BreadcrumbsService
    ]
})

export class SubjectModule { }

