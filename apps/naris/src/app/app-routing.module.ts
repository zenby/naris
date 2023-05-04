import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@soer/sr-auth';
import { SrDTOModule } from '@soer/sr-dto';
import { FeatureFlagGuard } from '@soer/sr-feature-flags';
import { DefaultComponent } from './pages/default/default.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'pages',
    component: DefaultComponent,
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
    resolve: {
      manifest: 'manifestEmitter',
      issues: 'issuesEmitter',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [FeatureFlagGuard],
    data: {
      requiredFeatureFlag: 'auth_v1',
      featureFlagRedirect: '/login-oauth',
    },
  },
  {
    path: 'login-oauth',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [FeatureFlagGuard],
    data: {
      requiredFeatureFlag: 'auth_v2',
      featureFlagRedirect: '/login',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SrDTOModule.forChild({
      namespace: 'manifest',
      schema: { url: 'user/manifest' },
      keys: {
        manifest: {},
      },
    }),
    SrDTOModule.forChild({
      namespace: 'issues',
      schema: { url: 'github' },
      keys: {
        issues: {},
      },
    }),
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '!' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
