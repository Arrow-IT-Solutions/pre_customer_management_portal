import { Inject, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { HeaderComponent } from './layout/header/header.component';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { SharedModule } from './shared/shared.module';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { DynamicDilogComponent } from './layout/component/dynamic-dilog/dynamic-dilog.component';
import { AdhostDirective } from './Core/directive/adhost.directive';
import { LocalService } from './shared/service/local.service';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './Core/services/user.service';

import { LayoutService } from './layout/service/layout.service';
import { ContentLayoutAdminComponent } from './layout/content-layout-admin/content-layout-admin.component';
import { HeaderAdminComponent } from './layout/content-layout-admin/pages/header-admin/header-admin.component';
import { MainMenuAdminComponent } from './layout/content-layout-admin/pages/main-menu-admin/main-menu-admin.component';
import { HasPermissionDirective } from './Core/directive/has-permission.directive';
import { DisableElementDirective } from './Core/directive/disable-element.directive';
import { MatButtonModule } from '@angular/material/button';
import { QRModule } from './modules/QR/qr.module';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    HeaderComponent,
    ContentLayoutComponent,
    AuthLayoutComponent,
    DynamicDilogComponent,
    AdhostDirective,
    ContentLayoutAdminComponent,
    HeaderAdminComponent,
    MainMenuAdminComponent,
    HasPermissionDirective,
    // DisableElementDirective,
  ],
  imports: [
    BrowserModule,
    QRModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],


})
export class AppModule implements OnInit {
  constructor(
    private localService: LocalService,
    public translate: TranslateService,
    public userService: UserService,
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localService.GetStorge();

    this.translate.use(layoutService.config.lang);

    this.document.documentElement.lang = layoutService.config.lang;

  }

  async ngOnInit() { }
}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
