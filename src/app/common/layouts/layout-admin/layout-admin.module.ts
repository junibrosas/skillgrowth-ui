import { MatMenuModule } from '@angular/material/menu';
import { LayoutAdminComponent } from './layout-admin.component';
import { MainHeaderComponent } from './../../components/headers/main-header/main-header.component';
import { MainFooterComponent } from './../../components/footers/main-footer/main-footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        RouterModule,
        MatCardModule,
        MatMenuModule
    ],
    exports: [
        LayoutAdminComponent,
    ],
    declarations: [
        LayoutAdminComponent,
        MainFooterComponent,
        MainHeaderComponent
    ],
})
export class LayoutAdminModule { }
