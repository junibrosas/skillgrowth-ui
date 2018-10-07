import { environment } from './../../environments/environment';

import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { RequestBase } from '../common/services/request-base';
import { ISubject } from './subject.types';
import { AppState } from './../common/reducers/index';

@Injectable()
export class SubjectService extends RequestBase {
    private apiUrl = `${environment.apiUrl}/subject/`;

    constructor(
        public http: HttpClient,
        private store: Store<AppState>
    ) {
        super(http);
    }

    getAll() {
        return this.http.get<ISubject[]>(this.apiUrl);
    }

    getByUser(userId: string) {
        const options = { params: new HttpParams().set('userId', userId.toString()) };
        return this.http.get<ISubject[]>(this.apiUrl, options);
    }

    create(subject: ISubject) {
        return this.http.post<ISubject>(this.apiUrl, subject);
    }

    update(subject: ISubject) {
        return this.http.put<ISubject>(this.apiUrl + subject.id, subject);
    }

    createOrUpdate(subject: ISubject) {
        if (subject.id) {
            return this.http.put<ISubject>(this.apiUrl + subject.id, subject);
        } else {
            return this.http.post<ISubject>(this.apiUrl, subject);
        }
    }

    delete(id: number) {
        return this.http.delete(this.apiUrl + id);
    }

    deleteSubjects(ids: number[]) {
        return this.http.post('/api/subjects/delete', ids);
    }

    getById(id: string) {
        return this.http.get<ISubject>(this.apiUrl + id);
    }
}
