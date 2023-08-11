import { Injectable } from '@angular/core';
import { MixedBusService, isBusMessage } from '@soer/mixed-bus';
import {
  ActivityType,
  PersonalActivityEventPayload,
  PersonalActivityService,
} from '@soer/naris/api/progress/personal-activityV2.service';
import { QuestionModel } from '@soer/naris/api/questions/question.model';
import { QuestionAskedEvent } from '../events/question-asked.event';

@Injectable({
  providedIn: 'root',
})
export class QuestionAskedSubscriber {
  private descriptionMaxLength = 150;

  constructor(private bus$: MixedBusService, private activityService: PersonalActivityService) {
    bus$.of(QuestionAskedEvent).subscribe((event) => {
      if (isBusMessage(event)) {
        const questionActivity = this.generateActivityItem(event.payload);
        this.activityService.storeActivity(questionActivity);
      }
    });
  }

  private generateActivityItem({ question, id }: QuestionModel): PersonalActivityEventPayload {
    const activityItem: PersonalActivityEventPayload = {
      type: ActivityType.QUESTION,
      description: question.substring(0, this.descriptionMaxLength),
      payload: {
        questionId: id ?? '',
      },
    };

    return activityItem;
  }
}
