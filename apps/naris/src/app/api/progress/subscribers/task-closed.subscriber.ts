import { Injectable } from '@angular/core';
import { MixedBusService, isBusMessage } from '@soer/mixed-bus';
import { ActivityType, PersonalActivityEventPayload, PersonalActivityService } from '../personal-activityV2.service';
import { TargetModel } from '../../targets/target.interface';
import { environment } from '../../../../environments/environment';
import { featuresEnum } from '../../../../environments/environment.interface';
import { TaskClosedEvent } from '../../../pages/modules/targets/events/task-closed.event';

@Injectable({
  providedIn: 'root',
})
export class TaskClosedSubscriber {
  constructor(private bus$: MixedBusService, private activityService: PersonalActivityService) {
    if (environment.features[featuresEnum.personal_activity_v2]) {
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
