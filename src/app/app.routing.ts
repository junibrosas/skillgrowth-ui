import { Routes } from '@angular/router';

import { NotFound404Component } from './not-found404.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/dashboard/subject', pathMatch: 'full' },
            { path: 'subject', loadChildren: './dashboard/subject/subject.module#SubjectModule' },
            { path: 'course', loadChildren: './dashboard/course/course.module#CourseModule' },
            { path: 'module', loadChildren: './dashboard/module/module.module#ModuleModule' },
            { path: 'user', loadChildren: './dashboard/user/user.module#UserModule' },
            // { path: '**', component: NotFound404Component }
        ]
    },
    { path: '**', component: NotFound404Component }
];
