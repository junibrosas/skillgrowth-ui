import { Component } from '@angular/core';

@Component({
    selector: 'app-auth-layout',
    styleUrls: [],
    template: `
    <div class="auth">
        <div class="auth-container">
            <ng-content></ng-content>
        </div>
    </div>`
})

export class LayoutAuthComponent {
    constructor() { }
}