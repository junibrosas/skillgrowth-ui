import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError, of } from 'rxjs';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { MaterialModule } from './../../material.module';
import { LoginComponent } from './login.container';
import { AuthService } from '../auth.service';
import { CommandResultService } from '../../common/services/command-result.service';
import { ILoginForm } from './../auth.types';
import { IUser } from '../../user/user.types';
import { USER_LEARNER, USER_CONTRIBUTOR, USER_ADMIN } from './../auth.constants';

@Component({ template: '<router-outlet></router-outlet>' })
class TestBootstrapComponent { }

@Component({ template: '' })
class TestComponent { }

describe('Container: LoginContainer', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let commandResultSpy: jasmine.SpyObj<CommandResultService>;
    const loginData: ILoginForm = {
        email: 'sample@gmail.com',
        password: 'asdqwe123'
    };
    const user: IUser = {
        id: '2',
        email: 'john@doe.com',
        password: 'asdqwe',
        userType: 'Learner',
        profile: {
            firstname: 'john',
            lastname: 'doe',
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MaterialModule,
                RouterTestingModule.withRoutes([
                    { path: 'course/feed', component: TestComponent }
                ]),
                BrowserAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['loginUser', 'logout']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService', ['prompSaved', 'promptError']) }
            ],
            declarations: [
                TestComponent,
                TestBootstrapComponent,
                LoginComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        authServiceSpy = TestBed.get(AuthService);
        commandResultSpy = TestBed.get(CommandResultService);
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    /**
     * UI Testing
     */

    it('should have correct elements', () => {
        const form = fixture.nativeElement.querySelectorAll('#login-form');
        const emailInput = fixture.nativeElement.querySelectorAll('.input-email');
        const passwordInput = fixture.nativeElement.querySelectorAll('.input-password');
        const submitButton = fixture.nativeElement.querySelectorAll('.input-password');
        const signUpLink = fixture.nativeElement.querySelectorAll('.link-signup');

        expect(emailInput.length).toBe(1);
        expect(passwordInput.length).toBe(1);
        expect(submitButton.length).toBe(1);
        expect(signUpLink.length).toBe(1);
        expect(form.length).toBe(1);
    });

    /**
     * Behavior Testing
     */

    it('should form not valid by default if submitted.', () => {
        component.submit();

        expect(component.form.valid).toBe(false);
    });

    /**
     * Test if form is submitted by triggering element event.
     */
    it('should form be valid if has proper form data when submitted.', () => {
        component.form.patchValue(loginData);
        component.submit();

        expect(component.form.valid).toBeTruthy();
    });

    it('should call service.loginUser() if form is submitted and valid.', () => {
        component.form.patchValue(loginData);
        component.submit();

        expect(authServiceSpy.loginUser.calls.count()).toBe(1, 'spy method was called once');
        expect(authServiceSpy.loginUser.calls.first().args[0].email).toBe(loginData.email);
        expect(authServiceSpy.loginUser.calls.first().args[0].password).toBe(loginData.password);
    });

    it('should have correct returned url if user is a Learner.', () => {
        expect(component.getReturnUrl(USER_LEARNER)).toBe('/course/feed');
    });

    it('should have correct returned url if user is a Contributor.', () => {
        expect(component.getReturnUrl(USER_CONTRIBUTOR)).toBe('/subject');
    });

    it('should have correct returned url if user is a Administrator.', () => {
        expect(component.getReturnUrl(USER_ADMIN)).toBe('/user');
    });

    it('should have correct returned url if user is an alien.', () => {
        expect(component.getReturnUrl(('Alien' as any))).toBe('/auth/login');
    });

    it('should have proper form default value.', () => {
        expect(component.form.get('email').value).toBe('');
        expect(component.form.get('password').value).toBe('');
    });

    it('should call logout() on component initialized', () => {
        expect(authServiceSpy.logout.calls.count()).toBe(1, 'spy method was called once');
    });

    it('should display success when register successfully.', () => {
        const serviceSpy = authServiceSpy.loginUser.and.returnValue(of(user));
        const routerSpy = spyOn((<any>component).router, 'navigateByUrl');

        component.form.patchValue(loginData);
        component.submit();

        expect(routerSpy.calls.first().args[0]).toBe('/course/feed');
    });

    it('should display error when AuthService fails', () => {
        const serviceSpy = authServiceSpy.loginUser.and.returnValue(throwError({ error: 'UserService test failure' }));

        component.form.patchValue(loginData);
        component.submit();

        expect(commandResultSpy.promptError.calls.first().args[0]).toBe('UserService test failure');
    });
});
