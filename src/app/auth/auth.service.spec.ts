import { MockBackend } from '@angular/http/testing';
import { TestBed, inject, fakeAsync, async } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('Service: AuthService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [AuthService]
        });
    });

    it('should be created', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));

    it('should have login user function', inject([AuthService], (service: AuthService) => {
        expect(service.loginUser).toBeTruthy();
    }));

    it('should have logout user function', inject([AuthService], (service: AuthService) => {
        expect(service.logout).toBeTruthy();
    }));

    /**
     * TODO:
     * Fix these tests on how to mock the real api endpoint to be able to test the response.
     */

    // it(`should send an expected login request`, async(inject([AuthService, HttpTestingController],
    //     (service: AuthService, backend: HttpTestingController) => {
    //         service.loginUser({ email: 'test@gmail.com', password: 'asdqwe123' }).subscribe();

    //         backend.expectOne((req: HttpRequest<any>) => {
    //             return req.url === '/api/authenticate'
    //                 && req.method === 'POST'
    //                 && req.body.email === 'test@gmail.com'
    //                 && req.body.password === 'asdqwe123';
    //         }, `POST to 'auth/login' with user and password`);
    //     }))
    // );

    // it('should emit "false" for 401 Unauthorized', async(inject([AuthService, HttpTestingController],
    //     (service: AuthService, backend: HttpTestingController) => {
    //         service.loginUser({ email: 'test@gmail.com', password: 'asdqwe123' }).subscribe(next => {
    //             expect(next).toBeFalsy();
    //         });

    //         backend.expectOne('/api/authenticate').flush(null, { status: 401, statusText: 'Email or password is incorrect' });
    //     }))
    // );

    // it(`should emit 'true' for 200 Ok`, async(inject([AuthService, HttpTestingController],
    //     (service: AuthService, backend: HttpTestingController) => {
    //         service.loginUser({ email: 'test@gmail.com', password: 'asdqwe123' }).subscribe(next => {
    //             expect(next).toBeTruthy();
    //         });

    //         backend.expectOne('/api/authenticate').flush(null, { status: 200, statusText: 'Ok' });
    //     }))
    // );
});

