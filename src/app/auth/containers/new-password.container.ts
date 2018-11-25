import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CommandResultService } from './../../common/services/command-result.service';
import { AuthService } from './../auth.service';
import { PasswordValidation } from '../../common/validations/password.validation';

@Component({
    selector: 'app-new-password',
    styles: [],
    template: `<app-auth-layout><mat-card>
        <div *ngIf="!isTokenInvalid">
            <p class="text-center">RESET PASSWORD</p>
            <p class="text-muted text-center">
                <small>Please enter your new password.</small>
            </p>
        </div>
        <div *ngIf="isTokenInvalid">
            <p class="text-center">TOKEN EXPIRED</p>
            <p class="text-muted text-center">
                <small>Please try again.</small>
            </p>
        </div>
        <form id="recovery-form" [formGroup]="form" novalidate="novalidate" (ngSubmit)="submit()" *ngIf="!isTokenInvalid">
            <mat-form-field class="form-gorup full-width">
                <input matInput type="password" placeholder="Password" required formControlName="password" />
                <mat-error *ngIf="password.hasError('minlength') && !password.hasError('required')">
                Password should be at least 6 digits</mat-error>
                <mat-error *ngIf="password.hasError('required')">Password is required</mat-error>
            </mat-form-field>
            <mat-form-field class="form-gorup full-width">
                <input matInput type="password" placeholder="Confirm password" required formControlName="confirmPassword" />
                <mat-error *ngIf="confirmPassword.hasError('matchPassword') && !password.hasError('required')">
                Password should be matched</mat-error>
                <mat-error *ngIf="confirmPassword.hasError('required')">Confirm Password is required</mat-error>
            </mat-form-field>
            <div class="martop-20">
                <button type="submit" mat-raised-button color="primary" class="full-width button-submit">
                    Submit
                </button>
            </div>
        </form>
        <div class="alert alert-danger" *ngIf="isTokenInvalid">Opps! Password reset token is invalid or has expired.</div>
    </mat-card></app-auth-layout>`
})

export class NewPasswordComponent implements OnInit {
    form: FormGroup;
    isTokenInvalid = false;
    token: string;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private commandResult: CommandResultService,
        private spinner: NgxSpinnerService,
    ) {
        this.route.paramMap.subscribe(pMap => {
            this.token = pMap.get('token');
        });
    }

    public ngOnInit() {
        this.initForm();
        this.checkResetToken();
    }

    public initForm() {
        this.form = this.fb.group({
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required])
        }, {
            validator: PasswordValidation.MatchPassword // extra validation method
        });
    }

    public checkResetToken() {
        this.spinner.show();
        this.authService.checkResetToken(this.token).subscribe(
            payload => {
                this.spinner.hide();
                if (payload.isAuthenticated) {
                    this.router.navigate(['/']);
                }
                this.isTokenInvalid = payload.isInvalid;
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    public submit() {
        if (this.form.valid) {
            this.authService.resetPassword(this.token, this.form.value.password, this.form.value.confirmPassword).subscribe(
                payload => {
                    this.router.navigate(['/auth/login']);
                    this.commandResult.promptSaved('You have successfully changed your password.');
                },
                error => {
                    this.commandResult.error(error);
                }
            );
        }
    }

    public get password() { return this.form.get('password'); }

    public get confirmPassword() { return this.form.get('confirmPassword'); }
}
