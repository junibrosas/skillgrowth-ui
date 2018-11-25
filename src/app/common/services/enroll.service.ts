import { IPayloadModule } from './../../dashboard/module/module.types';
import { ICourse, IPayloadCourse } from './../../dashboard/course/course.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestBase } from './request-base';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { CommandResultService } from './command-result.service';


@Injectable({
    providedIn: 'root'
})
export class EnrollService extends RequestBase {
    apiUrl = `${environment.apiUrl}/enroll/`;

    constructor(
        public http: HttpClient,
        private store: Store<AppState>,
        private commandResult: CommandResultService
    ) {
        super(http);
    }

    getByIdAndPublished(courseId: string, userId: string) {
        const options = { params: new HttpParams().set('user', userId.toString()) };
        return this.http.get<IPayloadCourse>(`${this.apiUrl}/course/` + courseId, options);
    }

    getEnrolledCoursesByUser(userId: string) {
        return this.http.get<ICourse[]>(`${this.apiUrl}/user/` + userId);
    }

    enrollCourseByUser(userId: string, courseId: string) {
        return this.http.post(`${this.apiUrl}`, { user: userId, course: courseId });
    }

    getByUserOwned(moduleId: string, userId: string) {
        const options = { params: new HttpParams().set('userId', userId.toString()) };
        return this.http.get<IPayloadModule>(`${this.apiUrl}/module/` + moduleId, options);
    }

    markAsComplete(moduleId: string, courseId: string, userId: string, markAsComplete: boolean) {
        const data = { moduleId, courseId, userId, complete: markAsComplete };
        return this.http.post(`${this.apiUrl}/module/complete/`, data);
    }
}


