import { Component, OnInit } from '@angular/core';

import { AlertService } from './../../services/alert.service';

@Component({
    selector: 'app-alert',
    styles: [],
    template: `<div
        *ngIf="message"
        [ngClass]="{ 'alert': message, 'alert-success': message.type === 'success', 'alert-danger': message.type === 'error' }">
    {{message.text}}
    </div>`
})

export class AlertComponent implements OnInit {
    message: string;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => {
            this.message = message;
        });
    }
}
