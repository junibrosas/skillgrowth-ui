import { Component, Input } from '@angular/core';

@Component({
    selector: 'page-header-component',
    styles: [],
    template: `<div class="page-header">
        <h5>{{title}}</h5>
        <ng-content></ng-content>
    </div>`
})

export class PageHeaderComponent {
    @Input() title = 'No Header';

    constructor() { }
}
