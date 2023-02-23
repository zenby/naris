import { Inject, Injectable } from '@angular/core';
import { BusEmitter } from '@soer/mixed-bus';
import { ProfileModel } from '@soer/soer-components';
import { DataStoreService, DtoPack, extractDtoPackFromBus, OK } from '@soer/sr-dto';
import { filter, map, Observable, take } from 'rxjs';
import { mapProfileDtoToModel } from '../helpers/profile-mapping.helper';
import { ProfileDto } from '@soer/sr-dto';

export const MANIFEST = 'manifest';

@Injectable()
export class ProfileDataService {
  public get profile$(): Observable<ProfileModel> {
    return this.selectProfile$();
  }
  
  constructor(
    @Inject(MANIFEST) private readonly manifestId: BusEmitter,
    private readonly store$: DataStoreService,
  ) {}

  public selectProfile$(): Observable<ProfileModel> {
    return extractDtoPackFromBus<ProfileDto>(this.store$.of(this.manifestId)).pipe(
        filter(({ status }: DtoPack<ProfileDto>) => status === OK),
        map(({ items }: DtoPack<ProfileDto>) => mapProfileDtoToModel(items[0])),
        take(1),
    );
  }
}
