import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ModuleProfileComponent } from './containers/module-profile.container';
import { moduleReducer } from './module.reducer';
import { SharedModule } from '../common/index';
import { ModuleService } from './module.service';
import { courseReducer } from '../course/course.reducer';
import { CourseService } from './../course/course.service';
import { ModuleOverviewComponent } from './containers/module-overview.container';
import { CommandResultService } from './../common/services/command-result.service';
import { AuthGuard } from './../auth/auth.guard';
import { AuthContributorGuard } from './../auth/auth.contributor.guard';

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

