import { AuthService } from './../auth.service';
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
    let authServiceSpy: jasmine.SpyObj<AuthService>;

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
                { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['registerUser']) },
                { provide: CommandResultService, useValue: jasmine.createSpyObj('CommandResultService', ['promptSaved', 'promptError']) }
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
        authServiceSpy = TestBed.get(AuthService);
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
});
