
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { ISubject } from './../../subject/subject.types';
import { SubjectService } from '../subject.service';
import { AppState } from '../../../common/reducers/index';
import { RESET_SUBJECT } from './../subject.actions';
import { CommandResultService } from './../../../common/services/command-result.service';
import { IUser } from './../../user/user.types';

@Component({
    selector: 'app-subject-profile',
    styles: [],
    template: `<form id="subject-editor-form" (ngSubmit)="submit(); form.valid ? f.resetForm() : null" [formGroup]="form" #f="ngForm">
        <div class="row">
            <div class="col-md-6">
                <mat-form-field class="form-group full-width">
                    <input matInput placeholder="Subject Name" formControlName="name" />
                    <mat-error *ngIf="f.submitted && name.hasError('required')">Title is required</mat-error>
                </mat-form-field>
            </div>
            <div class="col-md-6">
                <button mat-raised-button>{{buttonLabel}}</button>
                <button type="button" (click)="onReset()" mat-raised-button>{{buttonCancelLabel}}</button>
            </div>
        </div>
    </form>`
})

export class SubjectProfileComponent implements OnDestroy, OnInit {
    @Input() user: IUser;
    @Output() submitted = new EventEmitter<any>();

    subjectId: number;
    form: FormGroup;
    isEditable: boolean;
    subject: ISubject;
    currentUser: IUser;
    currentUserSubscription: Subscription;
    subjectSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private subjectService: SubjectService,
        private commandResult: CommandResultService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private spinner: NgxSpinnerService,
    ) {
        this.initForm();

        this.subjectSubscription = this.store.select(state => state.subject.profile).subscribe(subject => {
            this.form.patchValue(subject);
            this.subject = subject;
        });

        this.currentUserSubscription = this.store.select(state => state.session.user).subscribe(user => {
            this.currentUser = user;
        });

        this.subjectId = +this.route.snapshot.paramMap.get('id');
        this.isEditable = this.subjectId ? true : false;
    }

    ngOnInit() { }

    ngOnDestroy() {
        this.store.dispatch({ type: RESET_SUBJECT });
        this.currentUserSubscription.unsubscribe();
        this.subjectSubscription.unsubscribe();
    }

    initForm() {
        this.form = this.formBuilder.group({
            name: new FormControl('', [Validators.required])
        });
    }

    submit() {
        if (!this.form.valid) {
            return false;
        }

        let subject = { ...this.form.value, userId: this.currentUser.id }; // insert the current user id.

        if (this.subject.id) {
            subject = {...this.subject, ...subject};
        }

        this.spinner.show();

        this.subjectService.createOrUpdate(subject).subscribe(
            payload => {
                this.spinner.hide();
                this.onReset();
                this.commandResult.promptSaved();
                this.submitted.emit(subject);
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onReset() {
        this.store.dispatch({ type: RESET_SUBJECT });
    }

    trackByFn(index, item) {
        return index;
    }

    get name() {
        return this.form.get('name');
    }

    get buttonLabel() {
        return this.subject.id ? 'Save' : 'Add';
    }

    get buttonCancelLabel() {
        return this.subject.id ? 'New' : 'Cancel';
    }
}
