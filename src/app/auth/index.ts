import { ActivateUserComponent } from './containers/activate-user.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

import { RegisterComponent } from './containers/register.container';
import { AuthService } from './auth.service';
import { LoginComponent } from './containers/login.container';
import { SharedModule } from '../common/index';
import { PasswordRecoveryComponent } from './containers/password-recovery.container';
import { AlertComponent } from './../common/components/alerts/alert.component';
import { AlertService } from './../common/services/alert.service';
import { NewPasswordComponent } from './containers/new-password.container';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'password-recovery',
        component: PasswordRecoveryComponent
    },
    {
        path: 'reset/:token',
        component: NewPasswordComponent
    },
    {
        path: 'activate/:token',
        component: ActivateUserComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild(routes),

        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
    ],
    exports: [],
    declarations: [
        RegisterComponent,
        LoginComponent,
        PasswordRecoveryComponent,
        AlertComponent,
        NewPasswordComponent,
        ActivateUserComponent
    ],
    providers: [
        AuthService,
        AlertService,
    ]
})

export class AuthModule { }

