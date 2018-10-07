import { Component, Input } from '@angular/core';

@Component({
    selector: 'card-component',
    styles: [],
    template: `<div [class]="getCardClass">
        <div *ngIf="cardTitle" class="card-header">
            <div class="header-block">
                <p class="title"> {{ cardTitle }} </p>
            </div>
        </div>
        <div class="card-block">
            <ng-content></ng-content>
        </div>
        <div *ngIf="cardFooter" class="card-footer"> {{ cardFooter }} </div>
    </div>`
})

export class CardComponent {
    @Input() cardTitle: string;
    @Input() cardClass: string;
    @Input() cardFooter: string;

    constructor() { }

    get getCardClass() {
        return `card ${this.cardClass}`;
    }
}
