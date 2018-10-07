import { Component } from '@angular/core';

@Component({
    selector: 'app-content',
    styles: [],
    template: `<app-breadcrumb [allowBootstrap]="true"></app-breadcrumb>
        <div class="container">
            <hr class="mb-20" />
            <ng-content></ng-content>
        </div>`
})

export class ContentComponent {
    constructor() { }

}
