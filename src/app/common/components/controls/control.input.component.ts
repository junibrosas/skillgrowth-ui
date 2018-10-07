import { Component, OnChanges, Input } from '@angular/core';

@Component({
    selector: 'control-input',
    template: `<div class="form-group"
        [ngClass]="{'has-error': errorMessage && showErrors}">
        <label for="{{labelFor}}">{{labelText}}</label>
        <ng-content></ng-content>
        <span class="has-error" *ngIf="errorMessage && showErrors">
            {{errorMessage}}
        </span>
    </div>`,
})
export class ControlInputComponent implements OnChanges {
    @Input() labelText: string = '';
    @Input() labelFor: string = '';
    @Input() inputErrors: any;
    @Input() errorDefs: any;
    @Input() showErrors: boolean = false;

    errorMessage: string = '';

    ngOnChanges(changes: any): void {

        if (changes.inputErrors) {
            let errors: any = changes.inputErrors.currentValue;
            this.errorMessage = '';

            if (errors) {
                Object.keys(this.errorDefs).some(key => {
                    if (errors[key]) {
                        this.errorMessage = this.errorDefs[key];
                        return true;
                    }
                });
            }
        }
    }
}

