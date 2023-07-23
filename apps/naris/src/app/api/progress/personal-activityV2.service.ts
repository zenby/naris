import { Inject, Injectable } from '@angular/core';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { CommandCreate, CommandRead, DataStoreService, DtoPack } from '@soer/sr-dto';
import { Observable, of } from 'rxjs';
import { convertToJsonDTO, parseJsonDTOPack } from '../json.dto.helpers';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../../src/environments/environment';
import { FeatureFlag } from '@soer/sr-feature-flags';

export enum ActivityType {
  TARGET = 'TARGET',
  TASK = 'TASK',
}

export interface PayloadModel {
  [key: string]: string | number | Array<string | number | object> | object;
}

export interface PersonalActivityEventPayload {
  type: ActivityType;
  description: string;
  payload: PayloadModel;
}
export interface PersonalActivity extends PersonalActivityEventPayload {
  id?: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonalActivityService {
  public activities$: Observable<DtoPack<PersonalActivity[]>>;

  constructor(
    public store$: DataStoreService,
    public bus$: MixedBusService,
    @Inject('activityV2') private activityId: BusEmitter,
    @Inject('activitesV2') private activitesId: BusEmitter
  ) {
    if (environment.features[FeatureFlag.personal_activity_v2]) {
      this.activities$ = parseJsonDTOPack<PersonalActivity[]>(this.store$.of(this.activityId), 'activitesV2');
      bus$.publish(new CommandRead(activitesId));
    } else {
      this.activities$ = of({} as DtoPack<PersonalActivity[]>);
    }
  }

  public storeActivity(activityEventPayload: PersonalActivityEventPayload) {
    const newActivity: PersonalActivity = {
      ...activityEventPayload,
      uuid: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bus$.publish(new CommandCreate(this.activityId, convertToJsonDTO(newActivity, ['id']), { aid: 'new' }));
  }
}
