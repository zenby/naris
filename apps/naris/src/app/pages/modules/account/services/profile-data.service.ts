import { Inject, Injectable } from '@angular/core';
import { BusEmitter } from '@soer/mixed-bus';
import { DataStoreService, DtoPack, extractDtoPackFromBus, OK } from '@soer/sr-dto';
import { filter, map, Observable, take } from 'rxjs';
import { mapProfileDtoToView } from '../helpers/profile-mapping.helper';
import { ProfileView } from '../profile-view';
import { ProfileDto } from '../profile.dto';

export const MANIFEST = 'manifest';

@Injectable()
export class ProfileDataService {
  public profile$: Observable<ProfileView>;
  
  constructor(
    @Inject(MANIFEST) private readonly manifestId: BusEmitter,
    private readonly store$: DataStoreService,
  ) {
    this.profile$ = extractDtoPackFromBus<ProfileDto>(this.store$.of(this.manifestId)).pipe(
        filter(({ status }: DtoPack<ProfileDto>) => status === OK),
        map(({ items }: DtoPack<ProfileDto>) => mapProfileDtoToView(items[0])),
        take(1),
    )
  }  
}
