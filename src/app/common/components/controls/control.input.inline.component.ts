import { Component } from '@angular/core';

import { ControlInputComponent } from './control.input.component';

@Component({
    selector: 'control-input-inline',
    styles: [],
    template: `<div class="form-group row"
    [ngClass]="{'has-error': errorMessage && showErrors}">
        <label for="{{labelFor}}" class="col-sm-2 form-control-label text-xs-right">{{labelText}}</label>
        <div class="col-sm-10">
            <ng-content></ng-content>
            <span class="has-error" *ngIf="errorMessage && showErrors">
                {{errorMessage}}
            </span>
        </div>
    </div>`
})

export class ControlInputInlineComponent extends ControlInputComponent {

}
