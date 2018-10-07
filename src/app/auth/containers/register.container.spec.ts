import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { RegisterComponent } from './register.container';
import { UserService } from './../../user/user.service';
import { CommandResultService } from './../../common/services/command-result.service';
import { MaterialModule } from './../../material.module';
import { IRegisteForm } from '../auth.types';
import { IUser } from './../../user/user.types';

@Component({ template: '<router-outlet></router-outlet>' })
class TestBootstrapComponent { }

@Component({ template: '' })
class TestComponent { }

describe('Component: RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let commandResultSpy: jasmine.SpyObj<CommandResultService>;
    const formData: IRegisteForm = {
        id: '',
        email: 'john@doe.com',
        password: 'asdqwe',
        confirmPassword: 'asdqwe',
        isAgreeTerms: true,
        userType: 'Learner',
        firstname: 'john',
        lastname: 'doe'
    };
    const user: IUser = {
        id: '',
        email: 'john@doe.com',
        password: 'asdqwe',
        userType: 'Learner',
        profile: {
            firstname: 'john',
            lastname: 'doe',
        }
    };

    /**
     * TODO:
     * Fix these tests.
     */

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'auth/login', component: TestComponent }
                ]),
                MaterialModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: UserService, useValue: jasmine.createSpyObj('AuthService', ['create']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService', ['promptSaved', 'promptError']) },
            ],
            declarations: [
                TestBootstrapComponent,
                TestComponent,
                RegisterComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        userServiceSpy = TestBed.get(UserService);
        commandResultSpy = TestBed.get(CommandResultService);
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });


    /**
     * UI Testing
     */

    it('should have proper form default value.', () => {
        expect(component.form.get('firstname').value).toBe('');
        expect(component.form.get('lastname').value).toBe('');
        expect(component.form.get('email').value).toBe('');
        expect(component.form.get('password').value).toBe('');
        expect(component.form.get('confirmPassword').value).toBe('');
        expect(component.form.get('isAgreeTerms').value).toBe(false);
        expect(component.form.get('userType').value).toBe('');
    });


    /**
     * Behavior Testing
     */
    // it('should form not valid by default if submitted.', () => {
    //     let serviceSpy = userServiceSpy.create.and.returnValue(Observable.of(user));

    //     component.submit();

    //     expect(component.form.valid).toBe(false);
    // });

    // /**
    //  * Test if form is submitted by triggering element event.
    //  */
    // it('should form be valid if has proper form data when submitted.', () => {
    //     let serviceSpy = userServiceSpy.create.and.returnValue(Observable.of(user));

    //     component.form.patchValue(formData);
    //     component.submit();

    //     expect(component.form.valid).toBe(true);
    // });

    // it('should call service.loginUser() if form is submitted and valid.', () => {
    //     let serviceSpy = userServiceSpy.create.and.returnValue(Observable.of(user));

    //     component.form.patchValue(formData);
    //     component.submit();

    //     expect(userServiceSpy.create.calls.count()).toBe(1, 'spy method was called once');
    //     expect(userServiceSpy.create.calls.first().args[0].firstname).toBe(formData.firstname);
    //     expect(userServiceSpy.create.calls.first().args[0].lastname).toBe(formData.lastname);
    // });

    it('should getter firstname returns correct value.', () => {
        component.form.patchValue(formData);

        expect(component.firstname.value).toBe(formData.firstname);
    });

    it('should getter lastname returns correct value.', () => {
        component.form.patchValue(formData);
        expect(component.lastname.value).toBe(formData.lastname);
    });

    it('should getter email returns correct value.', () => {
        component.form.patchValue(formData);
        expect(component.email.value).toBe(formData.email);
    });

    it('should getter password returns correct value.', () => {
        component.form.patchValue(formData);
        expect(component.password.value).toBe(formData.password);
    });

    it('should getter confirmPassword returns correct value.', () => {
        component.form.patchValue(formData);
        expect(component.confirmPassword.value).toBe(formData.confirmPassword);
    });

    it('should getter isAgreeTerms returns correct value.', () => {
        component.form.patchValue(formData);
        expect(component.isAgreeTerms.value).toBe(formData.isAgreeTerms);
    });

    it('should getter userType returns correct value.', () => {
        component.form.patchValue(formData);
        expect(component.userType.value).toBe(formData.userType);
    });

    // it('should have correct navigation url when register successfully.', () => {
    //     let serviceSpy = userServiceSpy.create.and.returnValue(Observable.of(user));
    //     let routerSpy = spyOn((<any>component).router, 'navigateByUrl');

    //     component.form.patchValue(formData);
    //     component.submit();

    //     expect(routerSpy.calls.first().args[0]).toBe('auth/login');
    // });

    // it('should display success when register successfully.', () => {
    //     let serviceSpy = userServiceSpy.create.and.returnValue(Observable.of(user));

    //     component.form.patchValue(formData);
    //     component.submit();

    //     expect(commandResultSpy.promptSaved.calls.first().args[0]).toBe('Registration successful');
    // });

    // it('should display error when registration fails', () => {
    //     let serviceSpy = userServiceSpy.create.and.returnValue(new ErrorObservable('UserService test failure'));

    //     component.form.patchValue(formData);
    //     component.submit();

    //     expect(commandResultSpy.promptError.calls.first().args[0]).toBe('UserService test failure');
    // });
});
