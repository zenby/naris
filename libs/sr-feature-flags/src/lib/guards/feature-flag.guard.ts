import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { FeatureFlagService } from '../services/feature-flag.service';
import { FeatureFlag } from '../interfaces';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(private _featureFlags: FeatureFlagService, private _router: Router) {}
  canActivate(next: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredFeatureFlag: FeatureFlag = next.data['requiredFeatureFlag'];
    const featureFlagRedirect = (next.data['featureFlagRedirect'] as string) || '/';

    return this._featureFlags.isFeatureFlagEnabled(requiredFeatureFlag)
      ? true
      : this._router.createUrlTree([featureFlagRedirect]);
  }
}
