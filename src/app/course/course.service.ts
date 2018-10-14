import { CommandResultService } from './../common/services/command-result.service';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { RequestBase } from '../common/services/request-base';
import { ICourse, IPayloadCourse, IPayloadSearchCourse } from './course.types';
import { AppState } from '../common/reducers/index';
import { COMMON_SET_LISTGRID } from './../common/actions/common.actions';
import { environment } from '../../environments/environment';

@Injectable()
export class CourseService extends RequestBase {
    apiUrl = `${environment.apiUrl}/course/`;

    constructor(
        public http: HttpClient,
        private store: Store<AppState>,
        private commandResult: CommandResultService
    ) {
        super(http);
    }

    getAll() {
        return this.http.get<ICourse[]>(this.apiUrl);
    }

    create(course: ICourse) {
        return this.http.post<ICourse>(this.apiUrl, course);
    }

    update(course: ICourse) {
        return this.http.put<ICourse>(this.apiUrl + course.id, course);
    }

    createOrUpdate(course: ICourse) {
        if (course.id) {
            return this.http.put<ICourse>(this.apiUrl + course.id, course);
        } else {
            return this.http.post<ICourse>(this.apiUrl, course);
        }
    }

    delete(id: string) {
        return this.http.delete(this.apiUrl + id);
    }

    deleteCourses(ids: string[]) {
        return this.http.post('/api/courses/delete', ids);
    }

    getById(id: string) {
        return this.http.get<ICourse>(this.apiUrl + id);
    }

    getSubjectCourses(subjectId: string) {
        const options = { params: new HttpParams().set('subjectId', subjectId) };
        return this.http.get<ICourse[]>(this.apiUrl, options);
    }

    getList() {
        this.http.get<ICourse>('/api/list/courses/').subscribe(
            grid => this.store.dispatch({ type: COMMON_SET_LISTGRID, payload: grid }),
            error => this.commandResult.promptError()
        );
    }

    searchTerm(term: string) {
        const options = { params: new HttpParams().set('term', term) };
        return this.http.get<IPayloadSearchCourse>(this.apiUrl + 'search', options);
    }
}
