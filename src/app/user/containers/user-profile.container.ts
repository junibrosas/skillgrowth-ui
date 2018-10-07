import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { CommandResultService } from '../../common/services/command-result.service';
import { AppState } from '../../common/reducers';
import { USER_SET_PROFILE } from './../user.actions';
import { IUser } from '../user.types';

@Component({
    selector: 'app-user-profile',
    styles: [],
    template: `<app-content>
    <div class="row">
        <div class="col-md-3 user-details">
            <h5>{{ user.profile.fullname }}</h5>
            <p class="text-muted">{{ user.userType }}</p>
            <p><mat-icon>email</mat-icon> {{ user.email }}</p>
        </div>
        <div class="col-md-9">
            <mat-tab-group>
                <mat-tab label="Details">
                    <div class="mt-20">
                        <app-user-profile-form
                            [user]="user"
                            (onSubmitted)="onSubmitted($event)">
                        </app-user-profile-form>
                    </div>
                </mat-tab>
            </mat-tab-group>
        </div>
    </div>
    </app-content>`
})

export class UserProfileComponent implements OnInit {
    private userId: string;
    private user: IUser;
    private userSubscription: Subscription;

    constructor(
        private userService: UserService,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute,
        private commandResult: CommandResultService,
        private store: Store<AppState>
    ) {
        this.userSubscription = this.store.select(state => state.user.profile).subscribe(user => {
            this.user = user;
        });

        this.route.paramMap.subscribe(m => {
            this.userId = m.get('id');
        });
    }

    ngOnInit() {
        if (this.userId) {
            this.getUser();
        }
    }

    getUser() {
        this.spinner.show();

        this.userService.getById(this.userId).subscribe(
            user => {
                this.spinner.hide();
                this.store.dispatch({ type: USER_SET_PROFILE, payload: user });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    onSubmitted(data) {
        const user = { ...data, id: this.user.id };
        this.spinner.show();
        this.userService.update(user).subscribe(
            payload => {
                this.spinner.hide();
                this.commandResult.promptSaved();
                this.store.dispatch({ type: USER_SET_PROFILE, payload });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    private imageThumbnail() {
        return '../../../assets/images/placeholder.jpg';
    }
}

// <div [ngStyle]="{'background-image': 'url('+imageThumbnail(course)+')'}" class="card-image-bg"></div>
