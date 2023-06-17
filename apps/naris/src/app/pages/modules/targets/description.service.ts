import { Injectable } from '@angular/core';
import { BusEmitter, BusMessage, MixedBusService } from '@soer/mixed-bus';
import { CommandUpdate, DataStoreService, OK } from '@soer/sr-dto';
import { BehaviorSubject, first, Subscription } from 'rxjs';
import { convertToJsonDTO, parseJsonDTOPack } from '../../../api/json.dto.helpers';
import { TargetModel } from '../../../api/targets/target.interface';

@Injectable()
export class DescriptionService {
  private targetEmitter?: BusEmitter;
  private subscription?: Subscription;
  private busMessageSubject$?: BehaviorSubject<BusMessage>;

  private targetModel?: TargetModel;
  private path?: string;
  private _description: string | null = null;
  private _description$: BehaviorSubject<null | string> = new BehaviorSubject<null | string>(null);

  public get description$(): BehaviorSubject<null | string> {
    return this._description$;
  }

  constructor(private store$: DataStoreService, private bus$: MixedBusService) {}

  public init(emitter: BusEmitter, path: string) {
    this.path = path;
    this.targetEmitter = emitter;
    this.busMessageSubject$ = this.store$.of(this.targetEmitter);
    this.subscription = parseJsonDTOPack<TargetModel>(this.busMessageSubject$, 'Targets edit')
      .pipe(first((targetDTO) => targetDTO.status === OK))
      .subscribe((targetDTO) => {
        this.targetModel = targetDTO.items[0];
        this._description = this.getDescription();
        this.description$.next(this._description);
      });
  }

  public save() {
    if (!this.targetModel || !this.subTarget || this._description === null) {
      return;
    }
    this.subTarget.overview = this._description;
    const payload = { ...convertToJsonDTO(this.targetModel, ['id']), id: this.targetModel.id };
    this.bus$.publish(new CommandUpdate(this.targetEmitter, payload, { skipRoute: true }));
  }

  public setDescription(description: string | null) {
    this._description = description;
  }

  public getDescription(): string | null {
    return this.subTarget?.overview ?? null;
  }

  public resetDescription() {
    this._description = this.getDescription();
  }

  private get subTarget(): TargetModel | undefined {
    if (!this.targetModel || !this.path) {
      return;
    }

    if (this.path === 'root') {
      return this.targetModel;
    }

    const pathIndexes = this.path.split('-').map((n) => +n);
    let resultTarget = this.targetModel;

    for (let pointer = 1; pointer < pathIndexes.length; pointer++) {
      if (resultTarget && resultTarget.tasks) {
        const index = pathIndexes[pointer];
        resultTarget = resultTarget.tasks[index];
      }
    }
    return resultTarget;
  }

  destroy() {
    this._description = null;
    this.subscription?.unsubscribe();
    this.busMessageSubject$ = undefined;
  }
}
