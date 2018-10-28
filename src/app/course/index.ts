import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from '../common/index';
import { courseReducer } from './course.reducer';
import { subjectReducer } from '../subject/subject.reducer';
import { ModuleComponent } from '../module/module-list/module-list.component';
import { ModuleService } from './../module/module.service';
import { CourseOverviewComponent } from './containers/course-overview.container';
import { AuthClientGuard } from './../auth/auth.client.guard';
import { CourseFeedComponent } from './containers/course-feed.container';
import { AuthContributorGuard } from './../auth/auth.contributor.guard';
import { SubjectService } from './../subject/subject.service';
import { CourseService } from './course.service';
import { CourseSearchComponent } from './components/course-search.component';
import { CourseFeedListComponent } from './components/course-feed-list.component';
import { CommandResultService } from './../common/services/command-result.service';
import { CourseFilterComponent } from './components/course-filter.component';

export const routes: Routes = [
    {
        path: 'detail/:id',
        canActivate: [AuthClientGuard],
        component: CourseOverviewComponent
    },
    {
        path: 'feed',
        canActivate: [AuthClientGuard],
        component: CourseFeedComponent
    },
    {
        path: ':id',
        canActivate: [AuthContributorGuard],
        component: ModuleComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        StoreModule.forFeature('course', courseReducer),
        StoreModule.forFeature('subject', subjectReducer),
        RouterModule.forChild(routes),

        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    exports: [],
    declarations: [
        CourseFeedComponent,
        CourseOverviewComponent,
        CourseSearchComponent,
        CourseFilterComponent,
        CourseFeedListComponent,
        ModuleComponent
    ],
    providers: [
        ModuleService,
        CourseService,
        SubjectService,
        CommandResultService
    ]
})

export class CourseModule { }

