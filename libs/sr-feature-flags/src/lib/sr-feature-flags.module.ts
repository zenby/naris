import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagService } from './services/feature-flag.service';
import { FeatureFlagGuard } from './guards/feature-flag.guard';
import { APP_FEATURES } from './constants';

@NgModule({
  imports: [CommonModule],
  providers: [FeatureFlagService, FeatureFlagGuard],
})
export class SrFeatureFlagsModule {
  static forRoot<T>(features: T): ModuleWithProviders<SrFeatureFlagsModule> {
    return {
      ngModule: SrFeatureFlagsModule,
      providers: [
        {
          provide: APP_FEATURES,
          useValue: features,
        },
      ],
    };
  }
}
