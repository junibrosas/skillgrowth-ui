import { Component } from '@angular/core';

@Component({
    selector: 'main-footer-component',
    styles: [],
    template: `<footer class="docs-footer">
        <div class="container">
            <div class="docs-footer-copyright text-right">
                <span>Powered by Juni Brosas ©2018.</span>
                <span>All rights reserved.</span>
            </div>
        </div>
    </footer>`
})

export class MainFooterComponent {
    constructor() { }
}
