import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { UserListComponent } from './containers/user-list.container';
import { userReducer } from './user.reducer';
import { SharedModule } from '../../common';
import { UserProfileModalComponent } from './components/user-profile-modal.component';
import { AuthAdminGuard } from '../../auth/auth.admin.guard';
import { UserProfileComponent } from './containers/user-profile.container';
import { AuthGuard } from '../../auth/auth.guard';
import { UserProfileFormComponent } from './components/user-profile-form.component';
import { CommandResultService } from '../../common/services/command-result.service';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthAdminGuard],
        component: UserListComponent
    },
    {
        path: ':id',
        canActivate: [AuthGuard],
        component: UserProfileComponent
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('user', userReducer),

        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatTabsModule,
    ],
    exports: [],
    declarations: [
        UserListComponent,
        UserProfileComponent,
        UserProfileModalComponent,
        UserProfileFormComponent,
    ],
    entryComponents: [
        UserProfileModalComponent,
    ],
    providers: [
        CommandResultService,
    ]
})

export class UserModule { }
