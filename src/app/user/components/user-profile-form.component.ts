import { IUser } from './../user.types';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { PasswordValidation } from '../../common/validations/password.validation';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-profile-form',
    styles: [],
    template: `
    <form (ngSubmit)="submit();" [formGroup]="form" #f="ngForm">
        <mat-form-field class="form-group full-width">
            <input matInput placeholder="First name" formControlName="firstname" />
            <mat-error *ngIf="firstname.hasError('required')">First name is required</mat-error>
        </mat-form-field>
        <mat-form-field class="form-group full-width">
            <input matInput placeholder="Last name" formControlName="lastname" />
            <mat-error *ngIf="lastname.hasError('required')">Last name is required</mat-error>
        </mat-form-field>
        <mat-form-field class="form-gorup full-width">
            <input matInput type="password" placeholder="New password" formControlName="password" />
            <mat-error *ngIf="password.hasError('minlength') && !password.hasError('required')">
                Password should be at least 6 digits
            </mat-error>
            <mat-error *ngIf="password.hasError('required')">Password is required</mat-error>
        </mat-form-field>
        <mat-form-field class="form-gorup full-width">
            <input matInput type="password" placeholder="Confirm new password" formControlName="confirmPassword" />
            <mat-error *ngIf="confirmPassword.hasError('matchPassword') && !password.hasError('required')">
                Password should be matched
            </mat-error>
            <mat-error *ngIf="confirmPassword.hasError('required')">
                Confirm Password is required
            </mat-error>
        </mat-form-field>
        <div class="form-group mt-20">
            <button mat-raised-button color="primary">Save</button>
        </div>
    </form>`
})

export class UserProfileFormComponent implements OnInit, OnChanges {
    @Input() user: IUser;
    @Output() submitted = new EventEmitter<number>();

    form: FormGroup;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        const user: IUser = changes.user.currentValue;

        if (this.form) {
            if (changes.user.previousValue !== changes.user.currentValue) {
                this.form.patchValue({
                    firstname: user.profile.firstname,
                    lastname: user.profile.lastname
                });
            }
        }
    }

    initForm() {
        this.form = this.formBuilder.group({
            firstname: new FormControl(this.user.profile.firstname, [Validators.required]),
            lastname: new FormControl(this.user.profile.lastname, [Validators.required]),
            password: new FormControl('', [Validators.minLength(6)]),
            confirmPassword: new FormControl('', [])
        }, {
            validator: PasswordValidation.MatchPassword // extra validation method
        });
    }

    goBack() {
        this.router.navigate(['/']);
    }

    submit() {
        if (this.form.valid) {
            this.submitted.emit(this.form.value);
            this.form.patchValue({
                password: '',
                confirmPassword: ''
            });
        }
    }

    get firstname() { return this.form.get('firstname'); }

    get lastname() { return this.form.get('lastname'); }

    get password() { return this.form.get('password'); }

    get confirmPassword() { return this.form.get('confirmPassword'); }
}
