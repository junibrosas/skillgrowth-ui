import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ModuleProfileComponent } from './module-profile/module-profile.component';
import { moduleReducer } from './module.reducer';
import { SharedModule } from '../../common';
import { ModuleService } from './module.service';
import { courseReducer } from '../course/course.reducer';
import { CourseService } from '../course/course.service';
import { ModuleOverviewComponent } from './module-overview/module-overview.component';
import { CommandResultService } from '../../common/services/command-result.service';
import { AuthGuard } from '../../auth/auth.guard';
import { LayoutAdminModule } from './../../common/layouts/layout-admin/layout-admin.module';
import { AuthContributorGuard } from '../../auth/auth.contributor.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthContributorGuard],
        component: ModuleProfileComponent
    },
    {
        path: ':id',
        canActivate: [AuthContributorGuard],
        component: ModuleProfileComponent
    },
    {
        path: 'detail/:id',
        canActivate: [AuthGuard],
        component: ModuleOverviewComponent
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        QuillModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('course', courseReducer),
        StoreModule.forFeature('module', moduleReducer),
        LayoutAdminModule,

        MatFormFieldModule,
        MatInputModule,
    ],
    exports: [],
    declarations: [
        ModuleProfileComponent,
        ModuleOverviewComponent
    ],
    providers: [
        ModuleService,
        CourseService,
        CommandResultService
    ]
})

export class ModuleModule { }

