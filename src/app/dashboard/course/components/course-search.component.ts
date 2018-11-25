import { Subject } from 'rxjs';
import { IPayloadSearchCourse } from './../course.types';
import { Subscription } from 'rxjs';
import { CourseService } from './../course.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-course-search',
    styles: [],
    template: `<form [formGroup]="form" #f="ngForm">
        <mat-form-field class="full-width">
            <input matInput #searchBox placeholder="Search for courses"
            formControlName="term" id="search-box"
            (keyup)="search(searchBox.value)">
        </mat-form-field>
    </form>`
})

export class CourseSearchComponent implements OnInit, OnDestroy {
    @Output() whenTypeAhead: EventEmitter<IPayloadSearchCourse> = new EventEmitter();

    public typeaheadSubscription: Subscription;
    public form: FormGroup;
    searchTerms = new Subject<string>();

    constructor(
        private formBuilder: FormBuilder,
        private service: CourseService
    ) { }

    ngOnInit() {
        this.initForm();

        const typeahead = this.searchTerms.pipe(
            filter((text: string) => text.length > 2 || text.length === 0),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((text: string) => this.service.searchTerm(text))
        );

        this.typeaheadSubscription = typeahead.subscribe(payload => {
            this.whenTypeAhead.emit(payload);
        });
    }

    ngOnDestroy() {
        this.typeaheadSubscription.unsubscribe();
    }

    initForm() {
        this.form = this.formBuilder.group({
            term: new FormControl('')
        });
    }

    search(text: string) {
        this.searchTerms.next(text);
    }

    get term() {
        return this.form.get('term');
    }
}
