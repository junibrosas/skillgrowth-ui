import { Component } from '@angular/core';

@Component({
    selector: 'app-not-found',
    template: `<div class="container">
        <mat-card>
            <mat-card-title>Page not found :(</mat-card-title>
            <mat-card-content>Maybe the page you are looking for has been removed, or you typed in the wrong URL</mat-card-content>
        </mat-card>
    </div>`
})

export class NotFound404Component { }
