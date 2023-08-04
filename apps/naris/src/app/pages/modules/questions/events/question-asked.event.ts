import { ANY_SERVICE, BusEmitter, BusEvent } from '@soer/mixed-bus';
import { QuestionModel } from '@soer/naris/api/questions/question.model';

export class QuestionAskedEvent extends BusEvent {
  constructor(public override owner: BusEmitter = ANY_SERVICE, public override payload: QuestionModel) {
    super(owner, payload);
  }
}
