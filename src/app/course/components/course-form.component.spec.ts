import { ICourse } from './../course.types';
import { of, throwError } from 'rxjs';
import { CourseService } from './../course.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandResultService } from './../../common/services/command-result.service';
import { By } from '@angular/platform-browser';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { CourseFormComponent } from './course-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ModuleStatus } from '../../module/module.types';

@Component({
    template: `
    <course-form-component
        [subjectId]="subjectId"
        [course]="course"
        (submitted)="onSubmitted($event)"
        (reset)="onSubmitted($event)"></course-form-component>
    `
})
class ContentFormHostComponent {
    public course: ICourse = {
        id: '1',
        name: 'Course',
        subjectId: '1',
        modules: [],
        thumbnail: '',
        subject: null,
        isEnrolled: true
    };

    subjectId = 1;

    public onSubmitted(course: ICourse) { }
    public onReset() { }
}

describe('Component: CourseFormComponent', () => {
    let component: CourseFormComponent;
    let fixture: ComponentFixture<CourseFormComponent>;
    let componentHost: ContentFormHostComponent;
    let fixtureHost: ComponentFixture<ContentFormHostComponent>;
    let courseServiceSpy: jasmine.SpyObj<CourseService>;
    let commandResultServiceSpy: jasmine.SpyObj<CommandResultService>;
    let childElement: CourseFormComponent;
    const emptyCourse: ICourse = {
        id: '',
        name: '',
        description: '',
        subjectId: '',
        modules: []
    };
    const defaultCourse: ICourse = {
        id: '1',
        name: 'Course',
        subjectId: '1',
        modules: [{
            id: '2',
            name: 'Module',
            statusId: ModuleStatus.Publish,
            isCompleted: true,
            author: 'John Wick',
            dateCreated: new Date()
        }],
        thumbnail: '',
        subject: {
            id: '1',
            name: 'Subject',
            courses: []
        },
        isEnrolled: true
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
            declarations: [
                CourseFormComponent,
                ContentFormHostComponent
            ],
            providers: [
                { provide: CourseService, useValue: jasmine.createSpyObj('CourseService', ['create', 'update']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService',
                    ['promptSaved', 'promptError', 'promptDeleted'])
                },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        courseServiceSpy = TestBed.get(CourseService);
        commandResultServiceSpy = TestBed.get(CommandResultService);

        fixture = TestBed.createComponent(CourseFormComponent);
        component = fixture.componentInstance;

        fixtureHost = TestBed.createComponent(ContentFormHostComponent);
        componentHost = fixtureHost.componentInstance;
        fixtureHost.detectChanges();

        childElement = fixtureHost.debugElement.query(By.directive(CourseFormComponent)).componentInstance;
    });

    /**
     * UI Testing
     */
    it('should display form buttons', () => {
        const btnSaveElement = fixture.nativeElement.querySelectorAll('.btn-submit');
        const btnCancelElement = fixture.nativeElement.querySelectorAll('.btn-cancel');
        const fileElement = fixture.nativeElement.querySelectorAll('.inline-file-reader');
        const nameInput = fixture.nativeElement.querySelectorAll('.name-input');

        expect(btnSaveElement.length).toEqual(1);
        expect(btnSaveElement.length).toEqual(1);
        expect(fileElement.length).toEqual(1);
        expect(nameInput.length).toEqual(1);
    });

    it('should buttons have correct label if course is provided', () => {
        component.course = defaultCourse;

        expect(component.buttonCancelLabel).toBe('New');
        expect(component.buttonSaveLabel).toBe('Save');
    });

    it('should buttons have correct label if course is NOT provided', () => {
        component.course = emptyCourse;

        expect(component.buttonCancelLabel).toBe('Cancel');
        expect(component.buttonSaveLabel).toBe('Add');
    });

    it('should name property have correct value of form data is provided', () => {
        component.course = emptyCourse;
        fixture.detectChanges();
        component.form.patchValue({
            name: 'John'
        });

        expect(component.name.value).toBe('John');
    });

    it('should raise submitted() event when course submitted', () => {
        const spy = courseServiceSpy.create.and.returnValue(of(defaultCourse));
        let course: ICourse;

        component.submitted.subscribe(c => course = c);
        component.createOrUpdate(defaultCourse);

        expect(course).toBe(defaultCourse);
    });


    it('should subjectId be used in form', () => {
        component.course = defaultCourse;
        component.subjectId = 1;

        fixture.detectChanges();

        expect(component.form.get('subject').value).toEqual(component.subjectId);
    });

    /**
     * Behavior Testing
     */
    it('should raise reset event when clicked', () => {
        const spyMethod = spyOn(component.reset, 'emit');
        const element = fixture.debugElement.query(By.css('.btn-reset'));

        element.triggerEventHandler('click', null);

        expect(spyMethod.calls.any());
    });

    it('should createOrUpdate() execute error properly', () => {
        const spy = courseServiceSpy.create.and.returnValue(throwError('Test Failure'));
        const element = fixture.debugElement.query(By.css('#course-form'));

        component.createOrUpdate(defaultCourse);

        expect(commandResultServiceSpy.promptError.calls.any()).toBeTruthy();
    });

    /**
     * Component Host Testing
     */

    it('should host component properties confirm working on child component', () => {
        const input = fixtureHost.debugElement.query(By.css('.name-input')); // use fixture.debugElement object
        const el = input.nativeElement; // convert to nativeElement

        componentHost.course = defaultCourse;
        fixtureHost.detectChanges();

        expect(el.value).toBe('Course');
        expect(childElement.subjectId).toEqual(1);
    });
});
