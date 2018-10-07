import { Component, OnDestroy, OnInit } from '@angular/core';

import { ControlInputComponent } from './control.input.component';

@Component({
    selector: 'control-checkbox',
    styles: [],
    template: `<div class="form-group"
        [ngClass]="{'has-error': errorMessage && showErrors}">
        <label for="{{labelFor}}">{{labelText}}
            <ng-content></ng-content>
        </label>
        <span class="has-error" *ngIf="errorMessage && showErrors">
            {{errorMessage}}
        </span>
    </div>`
})

export class CheckboxControlComponent extends ControlInputComponent {

}
