import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './../../reducers/index';
import { IUser } from '../../../dashboard/user/user.types';
import { SESSION_SET_USER } from './../../actions/session.actions';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
})
export class LayoutAdminComponent implements OnInit {

  constructor(
      private store: Store<AppState>
  ) {
      const user: IUser = JSON.parse(localStorage.getItem('currentUser'));
      this.store.dispatch({ type: SESSION_SET_USER, payload: user });
  }

  ngOnInit() { }
}
