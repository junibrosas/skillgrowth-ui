import { IListGrid } from './../../common/types/common.types';
import { IUser } from './user.types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RequestBase } from '../../common/services/request-base';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService extends RequestBase {
    apiUrl = `${environment.apiUrl}/user/`;

    constructor(public http: HttpClient) {
        super(http);
    }

    getList() {
        return this.http.get<IListGrid>('/api/list/users/');
    }

    getAll() {
        return this.http.get<IUser[]>(this.apiUrl);
    }

    getById(id: string) {
        return this.http.get<IUser>(this.apiUrl + id);
    }

    update(user: IUser) {
        return this.http.put(this.apiUrl + user.id, user);
    }

    delete(id: string) {
        return this.http.delete(this.apiUrl + id);
    }

    deleteUsers(ids: string[]) {
        return this.http.post('/api/users/delete', ids);
    }
}

