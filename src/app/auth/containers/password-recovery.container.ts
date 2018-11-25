import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommandResultService } from './../../common/services/command-result.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-password-recovery',
    styles: [],
    template: `<app-auth-layout>
    <mat-card>
        <div *ngIf="!isSent">
            <p class="text-center">PASSWORD RECOVER</p>
            <p class="text-muted text-center">
                <small>Enter your email address to recover your password.</small>
            </p>
        </div>
        <div *ngIf="isSent">
            <p class="text-center">EMAIL SENT!</p>
            <p class="text-muted text-center">
                <small>Password reset instructions have been sent to your account's primary email address.</small>
            </p>
            <div class="text-center martop-20">
                <a class="pull-left" [routerLink]="'/auth/login'">Return to Login</a>
            </div>
        </div>
        <form id="recovery-form" [formGroup]="form" novalidate="novalidate" (ngSubmit)="submit()" *ngIf="!isSent">
            <mat-form-field class="form-gorup full-width">
                <input matInput placeholder="Email" formControlName="email" />
                <mat-error *ngIf="email.hasError('email') && !email.hasError('required')">Please enter a valid email address</mat-error>
                <mat-error *ngIf="email.hasError('required')">Email is required</mat-error>
            </mat-form-field>
            <div class="martop-20">
                <button mat-raised-button color="primary" class="full-width martop-20">Reset</button>
            </div>
            <div class="text-center martop-20">
                <a class="pull-left" [routerLink]="'/auth/login'">Return to Login</a>
            </div>
        </form>
    </mat-card>
    </app-auth-layout>`
})

export class PasswordRecoveryComponent {
    form: FormGroup;
    isSent: boolean;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private commandResult: CommandResultService,
        private spinner: NgxSpinnerService,
    ) {

        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email])
        });
    }

    submit() {
        if (this.form.valid) {
            this.spinner.show();
            this.authService.recoverPassword(this.form.value.email).subscribe(
                payload => {
                    this.isSent = true;
                    this.spinner.hide();
                },
                error => {
                    this.commandResult.error(error);
                    this.spinner.hide();
                }
            );
        }
    }

    get email() { return this.form.get('email'); }
}
