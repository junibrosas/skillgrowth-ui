import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CourseFilterComponent } from './course-filter.component';
import { MaterialModule } from '../../../material.module';
import { FilterCourse } from '../course.types';
import { By } from '@angular/platform-browser';

describe('Component: CourseFilterComponent', () => {
    let component: CourseFilterComponent;
    let fixture: ComponentFixture<CourseFilterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MaterialModule,
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                CourseFilterComponent
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseFilterComponent);
        component = fixture.componentInstance;
    });

    /**
     * Behavior Testing
     */

    it('should ngOnInit() execute initForm()', () => {
        const componentSpy = spyOn(component, 'initForm');

        component.ngOnInit();

        expect(componentSpy.calls.count()).toEqual(1);
    });

    it('should initForm() have default form values', () => {
        component.initForm();

        expect(component.form.get('filterBy').value).toEqual(FilterCourse.All);
    });

    it('should property filterData have correct values', () => {
        expect(component.filterData[0].id).toEqual(FilterCourse.All);
        expect(component.filterData[0].name).toEqual('Show all courses');
        expect(component.filterData[1].id).toEqual(FilterCourse.Enrolled);
        expect(component.filterData[1].name).toEqual('Show enrolled courses');
    });

    it('should property filterBy have correct value', () => {
        component.initForm();

        expect(component.filterBy.value).toEqual(component.form.get('filterBy').value);
    });

    it('should emit selected event when changed.', () => {
        let filterBy: FilterCourse;

        component.initForm();
        component.form.patchValue({
            filterBy: FilterCourse.Enrolled
        });
        component.selected.subscribe(value => {
            filterBy = value;
        });
        component.onFilterChange();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(filterBy).toEqual(FilterCourse.Enrolled);
        });
    });
});
