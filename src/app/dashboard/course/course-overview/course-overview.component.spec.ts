import { EnrollService } from './../../../common/services/enroll.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { CourseOverviewComponent } from './course-overview.component';
import { MaterialModule } from '../../../material.module';
import { commonReducer } from '../../../common/reducers/common.reducer';
import { courseReducer } from '../course.reducer';
import { subjectReducer } from '../../subject/subject.reducer';
import { sessionReducer } from '../../../common/reducers/session.reducer';
import { AppState } from './../../../common/reducers/index';
import { ActivatedRouteStub } from './../../../testing/activated-route.stub';
import { ICourse } from './../course.types';
import { BreadcrumbsService } from './../../../common/components/breadcrumbs/breadcrumbs.service';
import { CommandResultService } from './../../../common/services/command-result.service';
import { ModuleStatus } from '../../module/module.types';
import { throwError } from 'rxjs';
import { COMMON_BREADCRUMB_SET } from './../../../common/actions/common.actions';

@Component({ template: '<router-outlet></router-outlet>' })
class TestBootstrapComponent { }

@Component({ template: '' })
class TestComponent { }

describe('Component: CourseOverviewComponent', () => {
    let component: CourseOverviewComponent;
    let fixture: ComponentFixture<CourseOverviewComponent>;
    let commandResultServiceSpy: jasmine.SpyObj<CommandResultService>;
    let enrollServiceSpy: jasmine.SpyObj<EnrollService>;
    const mockActivatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    let store: Store<AppState>;
    const defaultCourse: ICourse = {
        id: '1',
        name: 'Sample course',
        subjectId: '1',
        thumbnail: 'path/to/image',
        modules: [{
            id: '1',
            name: 'Sample Module',
            statusId: ModuleStatus.Publish,
            isCompleted: true,
            author: 'Juni Brosas',
            dateCreated: new Date()
        }]
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                RouterTestingModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('common', commonReducer),
                StoreModule.forFeature('course', courseReducer),
                StoreModule.forFeature('subject', subjectReducer),
                StoreModule.forFeature('session', sessionReducer)
            ],
            declarations: [
                CourseOverviewComponent,
                TestBootstrapComponent,
                TestComponent,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: BreadcrumbsService, useValue: jasmine.createSpyObj('BreadcrumbsService', ['store']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService', ['error']) },
                { provide: EnrollService, useValue: jasmine.createSpyObj('EnrollService', ['getByIdAndPublished', 'enrollCourseByUser'])}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
        commandResultServiceSpy = TestBed.get(CommandResultService);
        enrollServiceSpy = TestBed.get(EnrollService);
        fixture = TestBed.createComponent(CourseOverviewComponent);
        component = fixture.componentInstance;
    });

    /**
     * Behavior Testing
     */
    it('should get proper router parameters', () => {
        mockActivatedRoute.setParamMap({ id: defaultCourse.id });

        expect(component.courseId).toEqual(defaultCourse.id.toString());
    });

    it('should ngOnInit() call getCourse()', () => {
        enrollServiceSpy.getByIdAndPublished.and.returnValue(of(defaultCourse));
        const componentSpy = spyOn(component, 'getCourse');

        component.ngOnInit();

        expect(componentSpy.calls.count()).toEqual(1);
    });

    it('should getCourse() call course service getByIdAndPublished() and call proper methods from success callback.', () => {
        const serviceSpy = enrollServiceSpy.getByIdAndPublished.and.returnValue(of({ course: defaultCourse, isEnrolled: true }));
        const storeSpy = spyOn(store, 'dispatch');

        mockActivatedRoute.setParamMap({ id: defaultCourse.id });
        component.getCourse();

        expect(serviceSpy.calls.count()).toEqual(1);
        expect(serviceSpy.calls.first().args[0]).toEqual(defaultCourse.id);
        expect(storeSpy.calls.count()).toEqual(2);
        expect(storeSpy.calls.first().args[0].type).toEqual(COMMON_BREADCRUMB_SET, 'wrong dispatched action');
        expect(storeSpy.calls.first().args[0].payload[0].label).toEqual('Courses', 'wrong course label');
        expect(storeSpy.calls.first().args[0].payload[0].url).toEqual('/dashboard/course/feed', 'wrong course url');
        expect(storeSpy.calls.first().args[0].payload[1].label).toEqual(defaultCourse.name, 'wrong course detail label');
        expect(storeSpy.calls.first().args[0].payload[1].url)
        .toEqual('/dashboard/course/detail/' + defaultCourse.id, 'wrong course detail url');
        expect(component.isEnrolled).toBeTruthy('wrong isEnrolled value');
        expect(component.dataSource.data.length).toEqual(1, 'wrong data source length');
    });

    it('should getCourse() call course service getByIdAndPublished() and call proper methods from error callback.', () => {
        enrollServiceSpy.getByIdAndPublished.and.returnValue(throwError('Test Failure'));

        component.getCourse();

        expect(commandResultServiceSpy.error.calls.count()).toEqual(1);
    });

    it('should enrollCourse() call course service enrollCourseByUser() and call proper methods from success callback', () => {
        enrollServiceSpy.enrollCourseByUser.and.returnValue(of({ course: defaultCourse, isEnrolled: true }));

        component.enrollCourse(defaultCourse.id.toString());

        expect(component.isEnrolled).toBeTruthy();
    });

    it('should enrollCourse() call course service enrollCourseByUser() and call proper methods from error callback', () => {
        enrollServiceSpy.enrollCourseByUser.and.returnValue(throwError('Test Failure'));

        component.enrollCourse(defaultCourse.id.toString());

        expect(commandResultServiceSpy.error.calls.count()).toEqual(1);
    });

    it('should viewModule() have correct navigation url', () => {
        const routerSpy = spyOn(component.router, 'navigate');

        component.isEnrolled = true;
        component.viewModule(defaultCourse.modules[0]);

        expect(routerSpy.calls.count()).toEqual(1);
        expect(routerSpy.calls.first().args[0][0]).toEqual('/dashboard/module/detail/');
        expect(routerSpy.calls.first().args[0][1]).toEqual(defaultCourse.modules[0].id);
    });

    it('should imageThumbnail() return correct path', () => {
        expect(component.imageThumbnail(defaultCourse)).toEqual('path/to/image');
    });

    it('should imageThumbnail() return default path', () => {
        const course = { ...defaultCourse, thumbnail: '' };

        expect(component.imageThumbnail(course)).toEqual('../../../../assets/images/placeholder.jpg');
    });

    it('should ngOnDestroy() unsubscribs', () => {
        const breadcrumbSpy = spyOn(component.breadcrumbsSubscription, 'unsubscribe');
        const currentUserSpy = spyOn(component.currentUserSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(breadcrumbSpy.calls.count()).toBe(1);
        expect(currentUserSpy.calls.count()).toBe(1);
    });
});
