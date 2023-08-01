import { ANY_SERVICE, BusEmitter, BusEvent } from '@soer/mixed-bus';
import { TargetModel } from '../../../../api/targets/target.interface';

export class TargetAchievedEvent extends BusEvent {
  constructor(public override owner: BusEmitter = ANY_SERVICE, public override payload: TargetModel) {
    super(owner, payload);
  }
}
