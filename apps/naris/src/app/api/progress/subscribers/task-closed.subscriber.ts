import { Injectable } from '@angular/core';
import { MixedBusService, isBusMessage } from '@soer/mixed-bus';
import { ActivityType, PersonalActivityEventPayload, PersonalActivityService } from '../personal-activityV2.service';
import { TargetModel } from '../../targets/target.interface';
import { environment } from '../../../../environments/environment';
import { TaskClosedEvent } from '../../../pages/modules/targets/events/task-closed.event';
import { FeatureFlag } from '@soer/sr-feature-flags';

@Injectable({
  providedIn: 'root',
})
export class TaskClosedSubscriber {
  constructor(private bus$: MixedBusService, private activityService: PersonalActivityService) {
    if (environment.features[FeatureFlag.personal_activity_v2]) {
      bus$.of(TaskClosedEvent).subscribe((event) => {
        if (isBusMessage(event)) {
          this.activityService.storeActivity(this.generateActivityItem(event.payload));
        }
      });
    }
  }

  private generateActivityItem(target: TargetModel): PersonalActivityEventPayload {
    return {
      type: ActivityType.TASK,
      description: `Выполнена задача ${target.title}`,
      payload: {
        targetId: target.id ?? '',
      },
    } as PersonalActivityEventPayload;
  }
}
