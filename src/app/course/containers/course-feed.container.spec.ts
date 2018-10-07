import { throwError, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { BreadcrumbsService } from './../../common/components/breadcrumbs/breadcrumbs.service';
import { CourseFeedComponent } from './course-feed.container';
import { commonReducer } from '../../common/reducers/common.reducer';
import { courseReducer } from '../course.reducer';
import { sessionReducer } from '../../common/reducers/session.reducer';
import { CommandResultService } from './../../common/services/command-result.service';
import { AppState } from './../../common/reducers/index';
import { CourseService } from './../course.service';
import { COURSE_USER_SET, SET_COURSES } from './../course.actions';
import { ICourse, FilterCourse } from './../course.types';

@Component({ template: '<router-outlet></router-outlet>' })
class TestBootstrapComponent { }

@Component({ template: '' })
class TestComponent { }

describe('Component: CourseFeedComponent', () => {
    let commandResultServiceSpy: jasmine.SpyObj<CommandResultService>;
    let breadcrumbServiceSpy: jasmine.SpyObj<BreadcrumbsService>;
    let component: CourseFeedComponent;
    let fixture: ComponentFixture<CourseFeedComponent>;
    let store: Store<AppState>;
    let courseServiceSpy: jasmine.SpyObj<CourseService>;
    const defaultCourse: ICourse = {
        id: '1',
        name: 'Sample course',
        subjectId: '1',
        modules: []
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('session', sessionReducer),
                StoreModule.forFeature('common', commonReducer),
                StoreModule.forFeature('course', courseReducer),
            ],
            declarations: [
                CourseFeedComponent,
                TestBootstrapComponent,
                TestComponent,
            ],
            providers: [
                { provide: CourseService, useValue: jasmine.createSpyObj('CourseService', ['getEnrolledCoursesByUser', 'getAll']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService',
                    ['promptSaved', 'promptError', 'promptDeleted'])
                },
                { provide: BreadcrumbsService, useValue: jasmine.createSpyObj('BreadcrumbsService', ['store']) },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
        courseServiceSpy = TestBed.get(CourseService);
        breadcrumbServiceSpy = TestBed.get(BreadcrumbsService);
        commandResultServiceSpy = TestBed.get(CommandResultService);
        fixture = TestBed.createComponent(CourseFeedComponent);
        component = fixture.componentInstance;
    });

    /**
     * Behavior Testing
     */

    it('should ngOnInit() execute proper methods', () => {
        const spy = courseServiceSpy.getEnrolledCoursesByUser.and.returnValue(of([defaultCourse]));
        const storeSpy = spyOn(store, 'dispatch');
        const spyMethod = spyOn(component, 'getAllCourses');

        fixture.detectChanges();

        expect(spyMethod.calls.count()).toEqual(1);
        expect(breadcrumbServiceSpy.store.calls.any()).toBeTruthy();
        expect(spy.calls.count()).toEqual(1);
        expect(storeSpy.calls.first().args[0].type).toBe(COURSE_USER_SET);
        expect(storeSpy.calls.first().args[0].payload.length).toEqual(1);
    });


    it('should getEnrolledCoursesByUser() executes proper methods on failure.', () => {
        const spy = courseServiceSpy.getEnrolledCoursesByUser.and.returnValue(throwError('CourseService test failure'));
        const spyMethod = spyOn(component, 'getAllCourses');

        fixture.detectChanges();

        expect(commandResultServiceSpy.promptError.calls.count()).toEqual(1);
        expect(spyMethod.calls.count()).toEqual(1);
    });

    it('should getAllCourses() executes proper methods on success.', () => {
        const spy = courseServiceSpy.getAll.and.returnValue(of([defaultCourse]));
        const storeSpy = spyOn(store, 'dispatch');

        component.getAllCourses();

        expect(storeSpy.calls.first().args[0].type).toBe(SET_COURSES);
        expect(storeSpy.calls.first().args[0].payload.length).toEqual(1);
    });

    it('should getAllCourses() executes proper methods on error.', () => {
        courseServiceSpy.getAll.and.returnValue(throwError('CourseService test failure'));

        component.getAllCourses();

        expect(commandResultServiceSpy.promptError.calls.count()).toEqual(1);
    });

    it('should ngOnDestroy() execute proper methods.', () => {
        const spyMethod = spyOn(component.currentUserSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(spyMethod.calls.count()).toBe(1);
    });

    it('should onSearchResponse() execute proper methods.', () => {
        const storeSpy = spyOn(store, 'dispatch');

        component.onSearchResponse([defaultCourse]);

        expect(storeSpy.calls.first().args[0].type).toBe(SET_COURSES);
        expect(storeSpy.calls.first().args[0].payload.length).toEqual(1);
    });

    it('should onFilterChange() execute proper methods on filter all', () => {
        const spyMethod = spyOn(component, 'getAllCourses');

        component.onFilterChange(FilterCourse.All);

        expect(spyMethod.calls.count()).toBe(1);
    });

    it('should onFilterChange() execute proper methods on filter enrolled', () => {
        const spy = courseServiceSpy.getEnrolledCoursesByUser.and.returnValue(of([defaultCourse]));
        const storeSpy = spyOn(store, 'dispatch');

        component.onFilterChange(FilterCourse.Enrolled);

        expect(spy.calls.count()).toEqual(1);
        expect(storeSpy.calls.first().args[0].type).toBe(SET_COURSES);
        expect(storeSpy.calls.first().args[0].payload.length).toEqual(1);
    });

    it('should onFilterChange() execute proper methods on filter enrolled failure', () => {
        const spy = courseServiceSpy.getEnrolledCoursesByUser.and.returnValue(throwError('CourseService test failure'));
        const storeSpy = spyOn(store, 'dispatch');

        component.onFilterChange(FilterCourse.Enrolled);

        expect(commandResultServiceSpy.promptError.calls.count()).toEqual(1);
    });

});
