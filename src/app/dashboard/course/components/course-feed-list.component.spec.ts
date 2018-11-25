import { RouterTestingModule } from '@angular/router/testing';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import { CourseFeedListComponent } from './course-feed-list.component';
import { ModuleStatus } from '../../module/module.types';
import { ICourse } from './../course.types';
import { MatCardModule } from '@angular/material';
import { Component } from '@angular/core';

@Component({ template: '<router-outlet></router-outlet>' })
class TestBootstrapComponent { }

@Component({ template: '' })
class TestComponent { }

describe('Component: CourseFeedList', () => {
    let component: CourseFeedListComponent;
    let fixture: ComponentFixture<CourseFeedListComponent>;
    const course: ICourse = {
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
                RouterTestingModule.withRoutes([
                    { path: 'course/detail/1', component: TestComponent }
                ]),
                MatCardModule
            ],
            declarations: [
                TestComponent,
                TestBootstrapComponent,
                CourseFeedListComponent
            ],
            providers: []
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseFeedListComponent);
        component = fixture.componentInstance;
    });

    /**
     * UI Testing
     */

    it('should have proper number of list items', () => {
        component.courses = [course];
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll('.list-item');

        expect(elements.length).toBe(1);
    });

    it('should have enrolled pin when a course is enrolled.', () => {
        component.courses = [course];
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll('.mat-card-pin');

        expect(elements.length).toBe(1);
    });

    it('should show alert if no records found.', () => {
        component.courses = [];
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('.alert-info').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(0);
    });

    /**
     * Behavior Testing
     */

    it('should have correct navigation url once list item is click', () => {
        const routerSpy = spyOn((<any>component).router, 'navigateByUrl');
        component.courses = [course];
        fixture.detectChanges();
        const element: DebugElement = fixture.debugElement.query(By.css('#list-item-0'));

        element.triggerEventHandler('click', null);

        expect(routerSpy.calls.first().args[0]).toBe('/dashboard/course/detail/1');
    });
});
