import { LayoutAdminModule } from './../common/layouts/layout-admin/layout-admin.module';
import { CourseService } from './../dashboard/course/course.service';
import { CommandResultService } from './../common/services/command-result.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseFeedListComponent } from './../dashboard/course/components/course-feed-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CourseSearchComponent } from '../dashboard/course/components/course-search.component';
import { CourseFilterComponent } from '../dashboard/course/components/course-filter.component';
import { MatSelectModule } from '@angular/material';
import { CourseModule } from '../dashboard/course/course.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatCardModule,
        MatSelectModule,
        LayoutAdminModule,
        CourseModule
    ],
    declarations: [
        HomeComponent,
    ],
    providers: [
        CommandResultService,
        CourseService
    ]
})
export class HomeModule { }
