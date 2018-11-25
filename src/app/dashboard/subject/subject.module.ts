import { CourseFormComponent } from './../course/components/course-form.component';
import { CourseModule } from './../course/course.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '../../common/index';
import { subjectReducer } from './subject.reducer';
import { SubjectProfileComponent } from './subject-profile/subject-profile.container';
import { SubjectComponent } from './subject-list/subject-list.component';
import { CourseListComponent } from '../course/course-list/course-list.component';
import { CourseService } from './../course/course.service';
import { SubjectService } from './subject.service';
import { BreadcrumbsService } from '../../common/components/breadcrumbs/breadcrumbs.service';
import { AuthContributorGuard } from './../../auth/auth.contributor.guard';
import { NotFound404Component } from './../../not-found404.component';
import { LayoutAdminModule } from './../../common/layouts/layout-admin/layout-admin.module';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthContributorGuard],
        component: SubjectComponent
    },
    {
        path: ':id',
        canActivate: [AuthContributorGuard],
        component: CourseListComponent
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
        LayoutAdminModule,

        MatFormFieldModule,
        MatInputModule,
    ],
    exports: [],
    declarations: [
        SubjectComponent,
        SubjectProfileComponent,
        CourseListComponent,
        CourseFormComponent
    ],
    providers: [
        SubjectService,
        CourseService,
        BreadcrumbsService
    ]
})

export class SubjectModule { }

