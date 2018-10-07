import { UserTypes } from './../auth.types';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../auth.service';
import { USER_LEARNER, USER_CONTRIBUTOR, USER_ADMIN } from '../auth.constants';
import { CommandResultService } from '../../common/services/command-result.service';

@Component({
    selector: 'app-login',
    styles: [],
    template: `
    <mat-card>
        <div>
            <p class="text-center">LOGIN TO CONTINUE</p>
        </div>
        <form id="login-form" class="login-form" [formGroup]="form" novalidate="novalidate" (ngSubmit)="submit()">
            <mat-form-field class="form-group full-width">
                <input matInput placeholder="Email" formControlName="email" class="input-email" />
                <mat-error *ngIf="email.hasError('email') && !email.hasError('required')">Please enter a valid email address</mat-error>
                <mat-error *ngIf="email.hasError('required')">Email is required</mat-error>
            </mat-form-field>
            <mat-form-field class="form-group full-width">
                <input matInput type="password" placeholder="Password" required formControlName="password" class="input-password" />
                <mat-error *ngIf="password.hasError('required')">Password is required</mat-error>
            </mat-form-field>
            <div class="form-group martop-10">
                <a [routerLink]="'/auth/password-recovery'" class="text-right">Forgot password?</a>
            </div>
            <div class="martop-20">
                <button type="submit" mat-raised-button color="primary" class="full-width button-submit">
                    Login
                </button>
            </div>
            <div class="text-center martop-20">
                <span>Do not have an account?</span> <a class="link-signup" [routerLink]="'/auth/register'">Sign Up!</a>
            </div>
        </form>
    </mat-card>`
})

export class LoginComponent implements OnDestroy, OnInit {
    form: FormGroup;
    returnUrl: string;

    constructor(
        private fb: FormBuilder,
        private service: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private commandResult: CommandResultService,
        private spinner: NgxSpinnerService,
    ) { }

    initForm() {
        this.form = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('')
        });
    }

    ngOnInit() {
        this.initForm();
        this.service.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    }

    ngOnDestroy() { }

    submit() {
        if (this.form.valid) {
            this.spinner.show();
            this.service.loginUser(this.form.value)
                .subscribe(
                    user => {
                        this.spinner.hide();
                        if (user.id && user.userType) {
                            this.router.navigateByUrl(this.getReturnUrl(user.userType));
                        } else {
                            this.commandResult.promptError('User was not returned.');
                        }
                    },
                    error => {
                        this.spinner.hide();
                        this.commandResult.error(error);
                });
        }
    }

    public getReturnUrl(type: UserTypes): string {
        if (this.route.snapshot.queryParams['returnUrl']) {
            return this.route.snapshot.queryParams['returnUrl'];
        }

        switch (type) {
            case USER_LEARNER:
                return '/course/feed';

            case USER_CONTRIBUTOR:
                return '/subject';

            case USER_ADMIN:
                return '/user';
            default:
                return '/auth/login';
        }
    }

    get email() { return this.form.get('email'); }

    get password() { return this.form.get('password'); }
}
