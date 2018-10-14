import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { IUserProfileDialog, IUser } from './../user.types';
import { UserService } from '../user.service';
import { AppState } from '../../common/reducers';
import { USER_UPDATE } from '../user.actions';
import { CommandResultService } from './../../common/services/command-result.service';

@Component({
    selector: 'app-user-profile-modal',
    styles: [],
    template: `
    <div>
        <h1 mat-dialog-title >Edit User</h1>
        <mat-dialog-content>
            <form (ngSubmit)="onSave(); f.resetForm()" [formGroup]="form" #f="ngForm">
                <mat-form-field class="form-group full-width">
                    <input matInput placeholder="First name" formControlName="firstname" />
                    <mat-error *ngIf="firstname.hasError('required')">First name is required</mat-error>
                </mat-form-field>
                <mat-form-field class="form-group full-width">
                    <input matInput placeholder="Last name" formControlName="lastname" />
                    <mat-error *ngIf="lastname.hasError('required')">Last name is required</mat-error>
                </mat-form-field>
            </form>
        </mat-dialog-content>
        <mat-dialog-actions class="float-right">
            <button mat-button (click)="onSave()">Save</button>
            <button mat-button (click)="onCancel()">Cancel</button>
        </mat-dialog-actions>
    </div>`
})

export class UserProfileModalComponent implements OnInit {
    form: FormGroup;

    constructor(
        private userService: UserService,
        private commandResult: CommandResultService,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private spinner: NgxSpinnerService,
        public dialogRef: MatDialogRef<UserProfileModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IUserProfileDialog
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.form = this.formBuilder.group({
            firstname: new FormControl(this.data.user.profile.firstname, [Validators.required]),
            lastname: new FormControl(this.data.user.profile.lastname, [Validators.required])
        });
    }

    onSave() {
        if (!this.form.valid) {
            return false;
        }
        const user: IUser = Object.assign({}, this.data.user, this.form.value);
        this.spinner.show();
        this.userService.update(user).subscribe(
            payload => {
                this.spinner.hide();
                this.store.dispatch({ type: USER_UPDATE, payload: payload });
                this.commandResult.promptSaved();
                this.dialogRef.close();
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    get firstname() { return this.form.get('firstname'); }

    get lastname() { return this.form.get('lastname'); }

    get email() { return this.form.get('email'); }
}
