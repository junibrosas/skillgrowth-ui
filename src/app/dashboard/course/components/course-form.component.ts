import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, Input, EventEmitter, Output, OnInit, OnChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { CourseService } from './../course.service';
import { ICourse } from './../course.types';
import { CommandResultService } from '../../../common/services/command-result.service';

@Component({
    selector: 'app-course-form',
    styles: [],
    template: `<form id="course-form" (ngSubmit)="submit(); form.valid && f.resetForm()" [formGroup]="form" #f="ngForm">
        <div class="row">
            <div class="col-md-6">
                <mat-form-field class="form-group full-width">
                    <input matInput placeholder="Course Name" class="name-input" formControlName="name" />
                    <mat-error *ngIf="f.submitted && name.hasError('required')">Title is required</mat-error>
                </mat-form-field>
            </div>
            <div class="col-md-2">
                <input type="file" accept="image/*" class="inline-file-reader" (change)="onChangeFileInput($event)">
            </div>
            <div class="col-md-4 text-right">
                <button type="submit" class="btn-submit" mat-raised-button>{{buttonSaveLabel}}</button>
                <button type="button" class="btn-reset" (click)="reset.emit()" mat-raised-button>{{buttonCancelLabel}}</button>
            </div>
        </div>
    </form>`
})

export class CourseFormComponent implements OnChanges, OnInit {
    @Input() course: ICourse;
    @Input() subjectId: number;
    @Output() submitted: EventEmitter<any> = new EventEmitter<any>();
    @Output() reset: EventEmitter<any> = new EventEmitter<any>();

    public form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private service: CourseService,
        private commandResult: CommandResultService,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: new FormControl('', [Validators.required]),
            thumbnail: new FormControl(''),
            subject: new FormControl(this.subjectId)
        });
    }

    ngOnChanges(data) {
        if (this.form) {
            this.form.patchValue({
                name: data.course.currentValue.name,
                subject: this.subjectId
            });
        }
    }

    submit() {
        if (!this.form.valid) {
            return false;
        }

        let course = this.form.value;

        if (this.course && this.course.id) {
            course = Object.assign({}, this.course, this.form.value);
        }

        this.createOrUpdate(course);
    }

    createOrUpdate(course: ICourse) {
        this.spinner.show();

        this.service.createOrUpdate(course).subscribe(
            payload => {
                this.spinner.hide();
                this.submitted.emit(course);
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onChangeFileInput($event) {
        const inputFile = $event.target;
        const file: File = inputFile.files[0];
        const reader: FileReader = new FileReader();

        reader.onloadend = (e) => {
            this.form.patchValue({
                thumbnail: reader.result
            });
        };

        reader.readAsDataURL(file);
    }

    get name() {
        return this.form.get('name');
    }

    get buttonSaveLabel() {
        return this.course && this.course.id ? 'Save' : 'Add';
    }

    get buttonCancelLabel() {
        return this.course && this.course.id ? 'New' : 'Cancel';
    }
}
