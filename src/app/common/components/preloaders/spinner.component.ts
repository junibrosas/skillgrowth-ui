import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'spinner-component',
    styles: [],
    template: `<div>asdasd</div>`
})

export class SpinnerComponent implements OnDestroy, OnInit, OnChanges {
    @Input() sample: string;
    constructor() { }

    ngOnInit() { }

    ngOnDestroy() { }

    ngOnChanges(data) {
        console.log(data);
    }
}
