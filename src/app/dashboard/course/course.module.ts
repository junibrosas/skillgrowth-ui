import { CourseFormComponent } from './components/course-form.component';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from '../../common';
import { courseReducer } from './course.reducer';
import { subjectReducer } from '../subject/subject.reducer';
import { ModuleListComponent } from '../module/module-list/module-list.component';
import { ModuleService } from '../module/module.service';
import { CourseOverviewComponent } from './course-overview/course-overview.component';
import { AuthClientGuard } from '../../auth/auth.client.guard';
import { CourseFeedComponent } from './course-feed/course-feed.component';
import { AuthContributorGuard } from '../../auth/auth.contributor.guard';
import { SubjectService } from '../subject/subject.service';
import { CourseService } from './course.service';
import { CourseSearchComponent } from './components/course-search.component';
import { CourseFeedListComponent } from './components/course-feed-list.component';
import { CommandResultService } from '../../common/services/command-result.service';
import { LayoutAdminModule } from './../../common/layouts/layout-admin/layout-admin.module';
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
        component: ModuleListComponent
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

        LayoutAdminModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule
    ],
    exports: [
        CourseSearchComponent,
        CourseFilterComponent,
        CourseFeedListComponent
    ],
    declarations: [
        CourseFeedComponent,
        CourseOverviewComponent,
        CourseSearchComponent,
        CourseFilterComponent,
        CourseFeedListComponent,
        ModuleListComponent
    ],
    providers: [
        ModuleService,
        CourseService,
        SubjectService,
        CommandResultService
    ]
})

export class CourseModule { }

