import { Component } from '@angular/core';

@Component({
    selector: 'app-auth-layout',
    styleUrls: ['./layout.auth.scss'],
    template: `
    <ngx-spinner
    bdOpacity = 0.7
    bdColor = "#e7cccc"
    size = "medium"
    color = "#181818"
    type = "ball-climbing-dot"
    ></ngx-spinner>
    <div class="auth">
        <div class="auth-container">
            <router-outlet></router-outlet>
        </div>
    </div>`
})

export class LayoutAuthComponent {
    constructor() { }
}
