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
import { FeatureFlagService, FeatureFlag, SrFeatureFlagsModule, Features } from '@soer/sr-feature-flags';
import { CliModule } from './cli/cli.module';
import { NarisCliService } from './cli/naris-cli.service';

registerLocaleData(ru);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MixedBusModule,
    SrAuthModule.forRoot(
      ((options) => {
        if (options.features[FeatureFlag.auth_v2]) {
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
    SrUrlBuilderModule.forRoot({ apiRoot: environment.apiUrl, narisApiUrl: environment.narisApiUrl }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzMessageModule,
    SrFeatureFlagsModule.forRoot<Features>(environment.features),
    SrDTOModule.forChild<ActivityKey>(
      environment.features[FeatureFlag.api_v2]
        ? {
            namespace: 'activity',
            schema: { url: '%%narisApiUrl%%v3/json/activity/:aid' },
            keys: {
              activity: { aid: '?' },
              activites: { aid: 'private' },
            },
          }
        : {
            namespace: 'activity',
            schema: { url: 'v2/json/activity/:aid' },
            keys: {
              activity: { aid: '?' },
              activites: { aid: 'personal' },
            },
          }
    ),
    CliModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        UrlBuilderService,
        MixedBusService,
        DataStoreService,
        StoreCrudService,
        PdfConverterService,
        NarisCliService,
        FeatureFlagService,
      ],
      useFactory:
        (
          _UrlBuilderService: UrlBuilderService,
          _MixedBusService: MixedBusService,
          _DataStoreService: DataStoreService,
          _StoreCrudService: StoreCrudService,
          _PdfConverterService: PdfConverterService,
          _NarisCliService: NarisCliService,
          _FeatureFlagService: FeatureFlagService
        ) =>
        () => {
          _NarisCliService.add({
            builder: _UrlBuilderService,
            store: _StoreCrudService,
            featureFlag: _FeatureFlagService.featureFlags,
            features: () => _FeatureFlagService.getAllFeatures(),
          });
          return null;
        },
    },
    { provide: NZ_I18N, useValue: ru_RU },
    ApplicationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
