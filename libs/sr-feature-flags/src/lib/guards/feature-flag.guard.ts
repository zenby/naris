import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { FeatureFlagService } from '../services/feature-flag.service';
@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(private _featureFlags: FeatureFlagService, private _router: Router) {}
  canActivate(next: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredFeatureFlag: string = next.data['requiredFeatureFlag'] as string;
    const featureFlagRedirect: string = (next.data['featureFlagRedirect'] as string) || '/';

    return this._featureFlags.isFeatureFlagEnabled(requiredFeatureFlag)
      ? true
      : this._router.createUrlTree([featureFlagRedirect]);
  }
}
