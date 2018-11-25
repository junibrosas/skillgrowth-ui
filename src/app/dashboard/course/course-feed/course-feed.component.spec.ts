import { HttpClientModule } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { BreadcrumbsService } from './../../../common/components/breadcrumbs/breadcrumbs.service';
import { CourseFeedComponent } from './course-feed.component';
import { commonReducer } from '../../../common/reducers/common.reducer';
import { courseReducer } from '../course.reducer';
import { sessionReducer } from '../../../common/reducers/session.reducer';
import { CommandResultService } from './../../../common/services/command-result.service';
import { AppState } from './../../../common/reducers/index';
import { CourseService } from './../course.service';
import { SET_COURSES } from './../course.actions';
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
                HttpClientModule,
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
                { provide: CourseService, useValue: jasmine.createSpyObj('CourseService', ['getAll']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService',
                ['promptSaved', 'error', 'promptDeleted'])
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

    it('should getAllCourses() executes proper methods on success.', () => {
        courseServiceSpy.getAll.and.returnValue(of([defaultCourse]));
        const storeSpy = spyOn(store, 'dispatch');

        component.getAllCourses();

        expect(storeSpy.calls.first().args[0].type).toBe(SET_COURSES);
        expect(storeSpy.calls.first().args[0].payload.length).toEqual(1);
    });

    it('should getAllCourses() executes proper methods on error.', () => {
        courseServiceSpy.getAll.and.returnValue(throwError('CourseService test failure'));

        component.getAllCourses();

        expect(commandResultServiceSpy.error.calls.count()).toEqual(1);
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
});
