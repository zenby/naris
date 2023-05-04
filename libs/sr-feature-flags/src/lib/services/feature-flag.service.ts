import { Inject, Injectable } from '@angular/core';
import { APP_FEATURES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  constructor(@Inject(APP_FEATURES) private features: { [key: string]: string }) {
    console.log(features);
  }

  isFeatureFlagEnabled(requiredFeatureFlag: string): boolean {
    return !!this.features[requiredFeatureFlag];
  }
}
