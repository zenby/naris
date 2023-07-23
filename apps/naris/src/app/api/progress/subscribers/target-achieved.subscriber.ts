import { Injectable } from '@angular/core';
import { MixedBusService, isBusMessage } from '@soer/mixed-bus';
import { TargetAchievedEvent } from '../../../pages/modules/targets/events/target-achieved.event';
import { ActivityType, PersonalActivityEventPayload, PersonalActivityService } from '../personal-activityV2.service';
import { TargetModel } from '../../targets/target.interface';
import { environment } from '../../../../../src/environments/environment';
import { featuresEnum } from '../../../../../src/environments/environment.interface';

@Injectable({
  providedIn: 'root',
})
export class TargetAchievedSubscriber {
  constructor(private bus$: MixedBusService, private activityService: PersonalActivityService) {
    if (environment.features[featuresEnum.personal_activity_v2]) {
      bus$.of(TargetAchievedEvent).subscribe((event) => {
        if (isBusMessage(event)) {
          this.activityService.storeActivity(this.generateActivityItem(event.payload));
        }
      });
    }
  }

  private generateActivityItem(target: TargetModel): PersonalActivityEventPayload {
    return {
      type: ActivityType.TARGET,
      description: `Достигнута цель ${target.title}`,
      payload: {
        targetId: target.id ?? '',
      },
    } as PersonalActivityEventPayload;
  }
}
