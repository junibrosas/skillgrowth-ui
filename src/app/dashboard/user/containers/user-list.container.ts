import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { BreadcrumbsService } from './../../../common/components/breadcrumbs/breadcrumbs.service';
import { IUser } from './../user.types';
import { UserService } from './../user.service';
import { AppState } from '../../../common/reducers/index';
import { USER_SET_USERS } from './../user.actions';
import { CommandResultService } from './../../../common/services/command-result.service';
import { UserProfileModalComponent } from '../components/user-profile-modal.component';
import { USER_ADMIN } from '../../../auth/auth.constants';

@Component({
    selector: 'app-user-list',
    styles: [],
    template: `<app-content>
        <div class="data-table">
            <mat-table #table [dataSource]="dataSource">
                <ng-container matColumnDef="firstname">
                    <mat-header-cell *matHeaderCellDef>First Name </mat-header-cell>
                    <mat-cell *matCellDef="let element"> {{element.firstname}} </mat-cell>
                </ng-container>

                <ng-container matColumnDef="lastname">
                    <mat-header-cell *matHeaderCellDef>Last Name </mat-header-cell>
                    <mat-cell *matCellDef="let element"> {{element.lastname}} </mat-cell>
                </ng-container>

                <ng-container matColumnDef="email">
                    <mat-header-cell *matHeaderCellDef>Email </mat-header-cell>
                    <mat-cell *matCellDef="let element"> {{element.email}} </mat-cell>
                </ng-container>

                <ng-container matColumnDef="userType">
                    <mat-header-cell *matHeaderCellDef>Type </mat-header-cell>
                    <mat-cell *matCellDef="let element"> {{element.userType}} </mat-cell>
                </ng-container>

                <ng-container matColumnDef="actions">
                    <mat-header-cell *matHeaderCellDef class="text-right">Actions </mat-header-cell>
                    <mat-cell *matCellDef="let element" class="text-right">
                        <button mat-icon-button class="pull-right" [matMenuTriggerFor]="listGridMenu" (click)="onSelectMenu(element)">
                            <mat-icon>more_vert</mat-icon>
                        </button>
                    </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
                <mat-row *matRowDef="let row; columns: columns;"></mat-row>
            </mat-table>
        </div>

        <mat-menu #listGridMenu="matMenu" (closed)="onMenuClosed()">
            <button mat-menu-item (click)="onEditItem()">
                <mat-icon>edit</mat-icon>
                <span>Edit</span>
            </button>
            <button mat-menu-item (click)="onDeleteItem()" *ngIf="isDeletable">
                <mat-icon>delete</mat-icon>
                <span>Delete</span>
            </button>
        </mat-menu>
    </app-content>`
})

export class UserListComponent implements OnInit, OnDestroy {
    users$: Observable<IUser[]>;
    users: IUser[];
    profile: IUser;
    dataSource = new MatTableDataSource([]);
    columns = ['firstname', 'lastname', 'email', 'userType', 'actions'];
    currentUser: IUser;
    usersSubscription: Subscription;
    currentUserSubscription: Subscription;
    selectedUserId: string;
    isDeletable: boolean;
    isModalOpened = false;

    constructor(
        private userService: UserService,
        private commandResult: CommandResultService,
        private store: Store<AppState>,
        private router: Router,
        private dialog: MatDialog,
        private breadcrumbs: BreadcrumbsService,
        private spinner: NgxSpinnerService,
    ) {
        this.usersSubscription = this.store.select(state => state.user.users).subscribe(users => {
            this.users = users;
            this.dataSource = new MatTableDataSource(users);
        });

        this.currentUserSubscription = this.store.select(state => state.session.user).subscribe(user => {
            this.currentUser = user;
        });
    }

    initBreadcrumbs(userName?: string) {
        this.breadcrumbs.store([
            { label: 'Users', url: '/user', params: [] },
            { label: userName ? userName : 'Manage Users', url: '', params: [] }
        ]);
    }

    ngOnInit() {
        this.initBreadcrumbs();
        this.getUsers();
    }

    ngOnDestroy() {
        this.usersSubscription.unsubscribe();
        this.currentUserSubscription.unsubscribe();
    }

    onSelectMenu(user: IUser) {
        this.initBreadcrumbs(user.profile.fullname);
        this.selectedUserId = user.id;
        this.isDeletable = user.userType !== USER_ADMIN;
    }

    onEditItem() {
        const user = this.users.find(u => u.id === this.selectedUserId);

        if (user) {
            const dialogRef = this.dialog.open(UserProfileModalComponent, {
                width: '500px',
                data: { user: user }
            });
            this.isModalOpened = true;

            dialogRef.afterClosed().subscribe(result => {
                this.isModalOpened = false;
                this.initBreadcrumbs();
            });
        }
    }

    onDeleteItem() {
        this.spinner.show();

        this.userService.delete(this.selectedUserId).subscribe(
            payload => {
                this.spinner.hide();
                this.getUsers();
                this.commandResult.promptDeleted();
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onMenuClosed() {
        if (this.isModalOpened === false) {
            this.initBreadcrumbs();
        }
    }

    getUsers() {
        this.spinner.show();

        this.userService.getAll().subscribe(
            users => {
                this.spinner.hide();
                this.store.dispatch({ type: USER_SET_USERS, payload: users });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }
}
