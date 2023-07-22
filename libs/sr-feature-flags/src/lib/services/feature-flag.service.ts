import { Inject, Injectable } from '@angular/core';
import { APP_FEATURES } from '../constants';
import { FeatureFlag, Features } from '../interfaces';

type FeatureFlagSetter = (value: boolean) => void;
type FeatureFlagsSetters = Record<FeatureFlag, { set: FeatureFlagSetter }>;

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  featureFlags: FeatureFlagsSetters;

  constructor(@Inject(APP_FEATURES) private features: Features) {
    this.featureFlags = this.buildFeatureFlags();
  }

  buildFeatureFlagSetter(featureFlag: FeatureFlag): FeatureFlagSetter {
    return (value: boolean) => {
      this.features = { ...this.features, [featureFlag]: value };
    };
  }

  isFeatureFlagEnabled(featureFlag: FeatureFlag): boolean {
    return !!this.features[featureFlag];
  }

  getAllFeatures(): Features {
    return this.features;
  }

  private buildFeatureFlags(): FeatureFlagsSetters {
    return Object.fromEntries(
      Object.keys(this.features).map((featureFlag) => [
        featureFlag,
        { set: this.buildFeatureFlagSetter(featureFlag as FeatureFlag) },
      ])
    ) as FeatureFlagsSetters;
  }
}
