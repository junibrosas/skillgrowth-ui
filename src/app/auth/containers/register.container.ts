import { AuthService } from './../auth.service';
import { IValueRecord } from './../../common/types/common.types';
import { UserService } from './../../user/user.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { AppState } from '../../common/reducers/index';
import * as Actions from './../../common/actions/common.actions';
import { PasswordValidation } from '../../common/validations/password.validation';
import { CommandResultService } from '../../common/services/command-result.service';

@Component({
    selector: 'app-register',
    styles: [],
    template: `<mat-card>
        <div>
            <p class="text-center">SIGN UP</p>
            <p class="text-muted text-center">
                <small>Start your free 30-day trial now.</small>
            </p>
        </div>
        <form id="register-form" [formGroup]="form" novalidate="novalidate" (ngSubmit)="submit()" #f="ngForm">
            <div class="row">
                <mat-form-field class="form-group col-md-6">
                    <input matInput placeholder="First name" formControlName="firstname" />
                    <mat-error *ngIf="firstname.hasError('required')">First name is required</mat-error>
                </mat-form-field>
                <mat-form-field class="form-group col-md-6">
                    <input matInput placeholder="Last name" formControlName="lastname" />
                    <mat-error *ngIf="lastname.hasError('required')">Last name is required</mat-error>
                </mat-form-field>
            </div>
            <mat-form-field class="form-group full-width">
                <input matInput placeholder="Email" formControlName="email" />
                <mat-error *ngIf="email.hasError('email') && !email.hasError('required')">Please enter a valid email address</mat-error>
                <mat-error *ngIf="email.hasError('required')">Email is required</mat-error>
            </mat-form-field>
            <div class="row">
                <mat-form-field class="form-group col-md-6">
                    <input matInput type="password" placeholder="Password" required formControlName="password" />
                    <mat-error *ngIf="password.hasError('minlength') && !password.hasError('required')">
                    Password should be at least 6 digits</mat-error>
                    <mat-error *ngIf="password.hasError('required')">Password is required</mat-error>
                </mat-form-field>
                <mat-form-field class="form-group col-md-6">
                    <input matInput type="password" placeholder="Confirm password" required formControlName="confirmPassword" />
                    <mat-error *ngIf="confirmPassword.hasError('matchPassword') && !password.hasError('required')">
                    Password should be matched</mat-error>
                    <mat-error *ngIf="confirmPassword.hasError('required')">Confirm Password is required</mat-error>
                </mat-form-field>
                <mat-form-field class="form-group full-width fixed-group">
                    <mat-select placeholder="Choose user type" formControlName="userType">
                        <mat-option *ngFor="let type of userTypes; trackBy: trackByFn" [value]="type.value">
                        {{ type.label }}
                        </mat-option>
                    </mat-select>
                    <mat-error *ngIf="userType.hasError('required')">User type is required</mat-error>
                </mat-form-field>
                <div class="form-group fixed-group with-error">
                    <div class="row ">
                        <div class="col-md-12 ">
                            <mat-checkbox formControlName="isAgreeTerms">Agree the terms and policy</mat-checkbox>
                            <mat-error *ngIf="f.submitted && isAgreeTerms.hasError('required')">
                            You must agree to the terms and policy</mat-error>
                        </div>
                    </div>
                </div>
            </div>
            <div class="martop-20">
                <button mat-raised-button color="primary" class="full-width martop-20">Sign up</button>
            </div>
            <div class="text-center martop-20">
                <span>Already have an account?</span> <a class="pull-left" [routerLink]="'/auth/login'">Login!</a>
            </div>
        </form>
    </mat-card>`
})

export class RegisterComponent implements OnInit {
    form: FormGroup;
    userTypes: IValueRecord[] = [
        { value: 'Learner', label: 'Learner' },
        { value: 'Contributor', label: 'Contributor' }
    ];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private commandResult: CommandResultService,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required]),
            isAgreeTerms: new FormControl(false, [Validators.requiredTrue]),
            userType: new FormControl('', [Validators.required]),
        }, {
                validator: PasswordValidation.MatchPassword // extra validation method
            });
    }

    submit() {
        const userData = this.form.value;
        userData.profile = {
            firstname: userData.firstname,
            lastname: userData.lastname
        };

        if (this.form.valid) {
            this.spinner.show();
            this.authService.registerUser(this.form.value).subscribe(
                user => {
                    this.spinner.hide();
                    /* tslint:disable: max-line-length */
                    // TODO: disable activation for now. Fix activation soon once email integrated properly.
                    // this.commandResult.success(`An activation token has been sent to ${this.form.value.email}. Please verify your email address within an hour to activate your account.`);
                    this.router.navigateByUrl('auth/login');
                },
                error => {
                    this.spinner.hide();
                    this.commandResult.error(error);
                });
        }
    }

    trackByFn(index, item) {
        return index;
    }

    get firstname() { return this.form.get('firstname'); }

    get lastname() { return this.form.get('lastname'); }

    get email() { return this.form.get('email'); }

    get password() { return this.form.get('password'); }

    get confirmPassword() { return this.form.get('confirmPassword'); }

    get isAgreeTerms() { return this.form.get('isAgreeTerms'); }

    get userType() { return this.form.get('userType'); }
}
