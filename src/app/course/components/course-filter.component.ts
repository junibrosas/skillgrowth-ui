import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FilterCourse } from './../course.types';
import { IRecord } from '../../common/types/common.types';

@Component({
    selector: 'course-filter',
    styles: [],
    template: `<form [formGroup]="form" #f="ngForm">
        <mat-form-field class="full-width">
            <mat-select placeholder="Filter" formControlName="filterBy" id="filter-select" (change)="onFilterChange()">
                <mat-option *ngFor="let filter of filterData; trackBy: trackByFn" [value]="filter.id">
                    {{ filter.name }}
                </mat-option>
            </mat-select>
        </mat-form-field>
    </form>`
})

export class CourseFilterComponent implements OnInit {
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    public form: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.form = this.formBuilder.group({
            filterBy: new FormControl(FilterCourse.All)
        });
    }

    trackByFn(index, item) {
        return index;
    }

    onFilterChange() {
        this.selected.emit(this.filterBy.value);
    }

    get filterBy() {
        return this.form.get('filterBy');
    }

    get filterData(): IRecord[] {
        return [
            { id: FilterCourse.All, name: 'Show all courses' },
            { id: FilterCourse.Enrolled, name: 'Show enrolled courses' }
        ];
    }
}
