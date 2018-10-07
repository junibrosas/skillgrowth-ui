import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainSidebarComponent } from './common/components/sidebars/main.sidebar.component';
import { MainFooterComponent } from './common/components/footers/main.footer.component';
import { LayoutAuthComponent } from './common/layouts/layout.auth.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterModule } from '@angular/router';

import { routes } from './app.routing';
import { AppComponent } from './app.component';
import { AuthClientGuard } from './auth/auth.client.guard';
import { AuthContributorGuard } from './auth/auth.contributor.guard';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { CustomSerializer, syncReducers, metaReducers } from './common/reducers/index';
import { JwtInterceptor } from './common/services/jwt.interceptor.service';
import { AlertService } from './common/services/alert.service';
import { BreadcrumbsService } from './common/components/breadcrumbs/breadcrumbs.service';
import { AuthAdminGuard } from './auth/auth.admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { LayoutAdminComponent } from './common/layouts/layout.admin.component';
import { MainHeaderComponent } from './common/components/headers/main.header.component';
import { NotFound404Component } from './not-found404.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from './common';
import { ToastrModule } from 'ngx-toastr';

// import { fakeBackendProvider } from './common/services/fake.backend.service';

@NgModule({
  declarations: [
    AppComponent,
    LayoutAdminComponent,
    LayoutAuthComponent,
    MainFooterComponent,
    MainHeaderComponent,
    MainSidebarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    NgxSpinnerModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(syncReducers, { metaReducers }),
    RouterModule.forRoot(routes, { useHash: false }),
    ToastrModule.forRoot()
  ],
  providers: [
    {
        provide: RouterStateSerializer,
        useClass: CustomSerializer
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
    },
    AuthGuard,
    AuthAdminGuard,
    AuthContributorGuard,
    AuthClientGuard,
    AuthService,
    UserService,
    AlertService,
    BreadcrumbsService,
    // fakeBackendProvider // Provider used to create fake backend. Remove this when real backend is integrated.
],
  bootstrap: [AppComponent]
})
export class AppModule { }
