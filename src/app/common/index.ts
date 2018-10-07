import { CommandResultService } from './services/command-result.service';
import { NotFound404Component } from './../not-found404.component';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { ListGridComponent } from './../common/components/list/list-grid.component';
import { ControlInputInlineComponent } from './components/controls/control.input.inline.component';
import { PageHeaderComponent } from './../common/components/headers/page.header.component';
import { ControlInputComponent } from './components/controls/control.input.component';
import { CheckboxControlComponent } from './components/controls/control.checkbox.component';
import { commonReducer } from './reducers/common.reducer';
import { CardComponent } from './components/elements/card.component';
import { ContentComponent } from './components/elements/content.component';
import { BreadcrumbComponent } from './components/breadcrumbs/breadcrumbs.component';

@NgModule({
    // import modules if they are used in the common components.
    imports: [
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,

        CommonModule,
        RouterModule,
        NgSelectModule,
        StoreModule.forFeature('common', commonReducer)
    ],
    exports: [
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,

        ListGridComponent,
        PageHeaderComponent,
        ControlInputInlineComponent,
        ControlInputComponent,
        CheckboxControlComponent,
        CardComponent,
        ContentComponent,
        RouterModule,
        NgSelectModule,
        BreadcrumbComponent,
    ],
    declarations: [
        ListGridComponent,
        PageHeaderComponent,
        ControlInputInlineComponent,
        ControlInputComponent,
        CheckboxControlComponent,
        CardComponent,
        ContentComponent,
        BreadcrumbComponent,
        NotFound404Component
    ],
    providers: [
        CommandResultService
    ]
})
export class SharedModule { }
