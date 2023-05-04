import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MixedBusModule, MixedBusService } from '@soer/mixed-bus';
import { AuthInterceptor, AUTH_ID, SrAuthModule } from '@soer/sr-auth';
import { DataStoreService, SrDTOModule, StoreCrudService, PdfConverterService } from '@soer/sr-dto';
import { SrUrlBuilderModule, UrlBuilderService } from '@soer/sr-url-builder';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { environment } from '../environments/environment';
import { IconsProviderModule } from '../icons-provider.module';
import { ActivityKey } from './api/progress/progress.const';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplicationService } from './services/application.service';
import { SrFeatureFlagsModule } from '@soer/sr-feature-flags';
import { DynamicConfig } from '../environments/environment.interface';

registerLocaleData(ru);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MixedBusModule,
    SrAuthModule.forRoot(
      ((options) => {
        if (options.features.auth_v2) {
          return {
            sid: AUTH_ID,
            schema: {
              cookieApi: `${options.urlV2}auth/cookie`,
              renewApi: `${options.urlV2}auth/access_token`,
              authApi: `${options.urlV2}auth/login/`,
            },
          };
        }
        return {
          sid: AUTH_ID,
          schema: {
            cookieApi: `${environment.apiUrl}auth/cookie`,
            renewApi: `${environment.apiUrl}auth/renew`,
            authApi: `${environment.apiUrl}auth/renew`,
          },
        };
      })(environment)
    ),
    SrUrlBuilderModule.forRoot({ apiRoot: environment.apiUrl }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzMessageModule,
    SrFeatureFlagsModule.forRoot<DynamicConfig>(environment.features),
    SrDTOModule.forChild<ActivityKey>({
      namespace: 'activity',
      schema: { url: 'v2/json/activity/:aid' },
      keys: {
        activity: { aid: '?' },
      },
    }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [UrlBuilderService, MixedBusService, DataStoreService, StoreCrudService, PdfConverterService],
      useFactory:
        (
          _UrlBuilderService: UrlBuilderService,
          _MixedBusService: MixedBusService,
          _DataStoreService: DataStoreService,
          _StoreCrudService: StoreCrudService,
          _PdfConverterService: PdfConverterService
        ) =>
        () =>
          null,
    },
    { provide: NZ_I18N, useValue: ru_RU },
    ApplicationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
