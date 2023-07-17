import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@soer/sr-auth';
import { FeatureFlagService } from '@soer/sr-feature-flags';
import { featuresEnum } from '../../../environments/environment.interface';
import { environment } from '../../../environments/environment';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'soer-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loading = true;
  public version = this.app.narisVersion;

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly featureFlags: FeatureFlagService,
    private app: ApplicationService
  ) {}

  ngOnInit(): void {
    const isAuth = this.authService.isAuth;

    if (isAuth) {
      this.router.navigate(['pages']);

      return;
    }

    this.loading = false;
  }

  oAuthLogin(provider: 'google' | 'yandex'): void {
    if (this.featureFlags.isFeatureFlagEnabled(featuresEnum.auth_v2)) {
      document.location = this.authService.getAuthUrlFor(provider);
      return;
    }

    const urls = {
      patreon: environment.patreonAuthUrl,
      google: environment.googleAuthUrl,
      yandex: environment.yandexAuthUrl,
    };

    document.location = urls[provider];

    return;
  }
}
