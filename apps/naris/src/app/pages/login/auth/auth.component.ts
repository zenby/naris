import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@soer/sr-auth';
import { FeatureFlagService } from '@soer/sr-feature-flags';
import { featuresEnum } from '../../../../environments/environment.interface';

@Component({
  selector: 'soer-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  private jwt: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly authService: AuthService,
    private readonly featureFlags: FeatureFlagService
  ) {}

  ngOnInit(): void {
    if (this.featureFlags.isFeatureFlagEnabled(featuresEnum.auth_v2)) {
      this.authService.token = null;
      this.authService.processAuth().then(() => {
        this.redirect();
      });
      return;
    }
    this.jwt = this.route.snapshot.queryParams?.['jwt'] ?? null;
    this.checkJWT(this.jwt);
  }

  checkJWT(token: string | null): void {
    if (token) {
      this.jwt = token;
      this.authService.updateToken(this.jwt);
    }
    this.redirect();
  }

  redirect(): void {
    if (this.authService.isAuth) {
      this.router.navigate(['pages']);
      return;
    }
    this.router.navigate(['login']);
  }
}
