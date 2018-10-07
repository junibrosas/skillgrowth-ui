import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { CourseSearchComponent } from './course-search.component';
import { CourseService } from '../course.service';

describe('Component: CourseSearchComponent', () => {
    let component: CourseSearchComponent;
    let fixture: ComponentFixture<CourseSearchComponent>;
    let courseServiceSpy: jasmine.SpyObj<CourseService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,

            ],
            declarations: [
                CourseSearchComponent
            ],
            providers: [
                { provide: CourseService, useValue: jasmine.createSpyObj('CourseService', ['']) }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

    }));

    beforeEach(() => {
        courseServiceSpy = TestBed.get(CourseService);
        fixture = TestBed.createComponent(CourseSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should ngOnInit() executes initForm()', () => {
        const componentSpy = spyOn(component, 'initForm');

        component.ngOnInit();

        expect(componentSpy.calls.count()).toEqual(1);
    });

    it('should ngOnDestroy() unscribes', () => {
        const componentSpy = spyOn(component.typeaheadSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(componentSpy.calls.count()).toBe(1);
    });

    it('should initForm() have correct form default value', () => {
        component.initForm();

        expect(component.form.get('term').value).toEqual('');
    });

    it('should property term returns correct value', () => {
        component.ngOnInit();
        component.form.patchValue({
            term: 'sample'
        });

        expect(component.term.value).toEqual('sample');
    });
});
