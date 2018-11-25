import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { RequestBase } from '../../common/services/request-base';
import { IModule, IPayloadModule } from './module.types';

@Injectable()
export class ModuleService extends RequestBase {
    apiUrl = `${environment.apiUrl}/module/`;

    constructor(public http: HttpClient) {
        super(http);
    }

    getList() {
        return this.http.get<IModule>('/api/list/modules/');
    }

    getAll() {
        return this.http.get<IModule>(this.apiUrl);
    }

    create(module: IModule) {
        return this.http.post<IModule>(this.apiUrl, module);
    }

    update(module: IModule) {
        return this.http.put<IModule>(this.apiUrl + module.id, module);
    }

    createOrUpdate(module: IModule) {
        if (module.id) {
            return this.http.put<IModule>(this.apiUrl + module.id, module);
        } else {
            return this.http.post<IModule>(this.apiUrl, module);
        }
    }

    delete(id: string) {
        return this.http.delete(this.apiUrl + id);
    }

    deleteModules(ids: string[]) {
        return this.http.post('/modules/delete', ids);
    }

    getById(id: string) {
        return this.http.get<IModule>(this.apiUrl + id);
    }
}
