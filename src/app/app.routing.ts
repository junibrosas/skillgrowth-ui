import { Routes } from '@angular/router';

import { NotFound404Component } from './not-found404.component';
import { LayoutAdminComponent } from './common/layouts/layout.admin.component';
import { AuthGuard } from './auth/auth.guard';
import { LayoutAuthComponent } from './common/layouts/layout.auth.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: LayoutAuthComponent,
        loadChildren: './auth/index#AuthModule'
    },
    {
        path: '',
        component: LayoutAdminComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/subject', pathMatch: 'full' },
            { path: 'course', loadChildren: './course/index#CourseModule' },
            { path: 'module', loadChildren: './module/index#ModuleModule' },
            { path: 'subject', loadChildren: './subject/index#SubjectModule' },
            { path: 'user', loadChildren: './user/index#UserModule' },
            { path: '**', component: NotFound404Component }
        ]
    },
    { path: '**', component: NotFound404Component }
];
