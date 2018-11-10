import { throwError, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CourseComponent } from './course.container';
import { subjectReducer } from '../../subject/subject.reducer';
import { courseReducer } from '../course.reducer';
import { CourseService } from '../course.service';
import { SubjectService } from '../../subject/subject.service';
import { CommandResultService } from '../../common/services/command-result.service';
import { AppState } from '../../common/reducers';
import { BreadcrumbsService } from './../../common/components/breadcrumbs/breadcrumbs.service';
import { commonReducer } from '../../common/reducers/common.reducer';
import { COMMON_BREADCRUMB_SET, COMMON_SET_LISTGRID } from './../../common/actions/common.actions';
import { ICourse } from './../course.types';
import { ISubject } from './../../subject/subject.types';
import { ActivatedRouteStub } from './../../testing/activated-route.stub';
import { RESET_COURSE, SET_COURSE } from './../course.actions';
import { HttpClientModule } from '@angular/common/http';

@Component({ template: '<router-outlet></router-outlet>' })
class TestBootstrapComponent { }

@Component({ template: '' })
class TestComponent { }

describe('Component: CourseComponent', () => {
    let component: CourseComponent;
    let fixture: ComponentFixture<CourseComponent>;
    let store: Store<AppState>;
    let courseServiceSpy: jasmine.SpyObj<CourseService>;
    let subjectServiceSpy: jasmine.SpyObj<SubjectService>;
    let commandResultServiceSpy: jasmine.SpyObj<CommandResultService>;
    const mockActivatedRoute = new ActivatedRouteStub();
    const defaultCourse: ICourse = {
        id: '1',
        name: 'Sample course',
        subjectId: '1',
        modules: []
    };
    const defaultSubject: ISubject = {
        id: '1',
        name: 'Sample subject',
        courses: [defaultCourse]
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('common', commonReducer),
                StoreModule.forFeature('course', courseReducer),
                StoreModule.forFeature('subject', subjectReducer),
            ],
            declarations: [
                CourseComponent,
                TestBootstrapComponent,
                TestComponent
            ],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: CourseService, useValue: jasmine.createSpyObj('CourseService', ['delete']) },
                { provide: SubjectService, useValue: jasmine.createSpyObj('SubjectService', ['getById']) },
                { provide: BreadcrumbsService, useValue: jasmine.createSpyObj('BreadcrumbsService', ['store']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService',
                ['promptSaved', 'promptError', 'promptDeleted', 'error']) }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
        courseServiceSpy = TestBed.get(CourseService);
        subjectServiceSpy = TestBed.get(SubjectService);
        commandResultServiceSpy = TestBed.get(CommandResultService);
        fixture = TestBed.createComponent(CourseComponent);
        component = fixture.componentInstance;
    });

    /**
     * Behavior Testing
     */
    it('should dispatch actions properly when getSubject() suceeds.', () => {
        const serviceSpy = subjectServiceSpy.getById.and.returnValue(of(defaultSubject));
        const spy = spyOn(store, 'dispatch');

        component.getSubject();

        expect(spy.calls.first().args[0].type).toBe(COMMON_SET_LISTGRID);
        expect(spy.calls.first().args[0].payload.length).toEqual(1);
        expect(spy.calls.mostRecent().args[0].type).toBe(COMMON_BREADCRUMB_SET);
        expect(spy.calls.mostRecent().args[0].payload.length).toEqual(2);
    });

    it('should prompt error be called when getSubject() fails.', () => {
        subjectServiceSpy.getById.and.returnValue(throwError('SubjectService test failure.'));

        component.getSubject();

        expect(commandResultServiceSpy.error.calls.any()).toBeTruthy();
    });

    it('should execute functions properly on destroy', () => {
        const storeSpy = spyOn(store, 'dispatch');
        const subscriptionSpy = spyOn(component.breadcrumbsSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(storeSpy.calls.first().args[0].type).toBe(RESET_COURSE);
        expect(subscriptionSpy.calls.any()).toBeTruthy();
    });

    it('should call getSubject() when subjectId is available.', () => {
        const serviceSpy = subjectServiceSpy.getById.and.returnValue(of(defaultSubject));

        mockActivatedRoute.setParamMap({ id: defaultSubject.id });
        fixture.detectChanges();

        expect(serviceSpy.calls.any()).toBeTruthy();
        expect(component.subject.id).toBe(defaultSubject.id);
        expect(component.subjectId).toBe(defaultSubject.id.toString());
    });

    it('should onSelectItem() navigates for proper url.', () => {
        const routerSpy = spyOn((component as any).router, 'navigate');
        component.onSelectItem(defaultCourse.id.toString());

        expect(routerSpy.calls.first().args[0][0]).toBe('/course/');
        expect(routerSpy.calls.first().args[0][1]).toEqual(defaultCourse.id);
    });

    it('should onEditItem() dispatch action properly', () => {
        const storeSpy = spyOn(store, 'dispatch');

        component.subject = defaultSubject;
        component.onEditItem(defaultCourse.id.toString());

        expect(storeSpy.calls.first().args[0].type).toBe(SET_COURSE);
        expect(storeSpy.calls.first().args[0].payload.id).toEqual(defaultCourse.id);
    });

    it('should onDeleteItem() success execute proper methods', () => {
        const spy = courseServiceSpy.delete.and.returnValue(of(true));
        const spyMethod = spyOn(component, 'getSubject');

        component.onDeleteItem(defaultCourse.id.toString());

        expect(spy.calls.any()).toBeTruthy();
        expect(spyMethod.calls.count()).toBe(1);
        expect(commandResultServiceSpy.promptDeleted.calls.count()).toBe(1);
    });

    it('should onDeleteItem() error execute proper methods', () => {
        const spy = courseServiceSpy.delete.and.returnValue(throwError('CourseService test failure'));

        component.onDeleteItem(defaultCourse.id.toString());

        expect(spy.calls.any()).toBeTruthy();
        expect(commandResultServiceSpy.error.calls.count()).toBe(1);
    });

    it('should onSubmitted() execute proper methods.', () => {
        const spy = spyOn(component, 'onSuccess');

        component.onSubmitted(defaultCourse);

        expect(spy.calls.count()).toBe(1);
    });

    it('should onReset() execute proper methods.', () => {
        const storeSpy = spyOn(store, 'dispatch');

        component.onReset();

        expect(storeSpy.calls.count()).toBe(1);
        expect(storeSpy.calls.first().args[0].type).toBe(RESET_COURSE);
    });

    it('should onSuccess() execute proper methods.', () => {
        const storeSpy = spyOn(store, 'dispatch');
        const spyComponentMethod = spyOn(component, 'getSubject');

        component.onSuccess();

        expect(spyComponentMethod.calls.count()).toBe(1);
        expect(storeSpy.calls.first().args[0].type).toBe(RESET_COURSE);
        expect(commandResultServiceSpy.promptSaved.calls.count()).toBe(1);
    });
});
