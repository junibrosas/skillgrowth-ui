import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './../auth.service';
import { CommandResultService } from './../../common/services/command-result.service';

@Component({
    selector: 'app-activate-user',
    styles: [],
    template: `<mat-card>
        Please wait for your account verification response.
    </mat-card>`
})

export class ActivateUserComponent implements OnInit {
    token: string;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private commandResult: CommandResultService,
        private spinner: NgxSpinnerService,
    ) {
        this.route.paramMap.subscribe(p => {
            this.token = p.get('token');
        });
    }

    ngOnInit() {
        this.activateUser();
    }

    activateUser() {
        this.spinner.show();
        this.authService.activateUser(this.token).subscribe(
            payload => {
                this.spinner.hide();
                if (payload.isValid) {
                    this.commandResult.promptSaved(payload.message);
                } else {
                    this.commandResult.promptError(payload.message);
                }

                this.router.navigate(['auth/login']);
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }
}
