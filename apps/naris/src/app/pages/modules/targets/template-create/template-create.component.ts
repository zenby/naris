import { Component, Inject } from '@angular/core';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import {
  CommandCreate,
  DataStoreService,
  deSerializeJson,
  extractDtoPackFromBus,
  SerializedJsonModel,
} from '@soer/sr-dto';
import { EMPTY_TARGET, TargetModel, TemplateModel } from '../../../../api/targets/target.interface';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { target2template } from '../targets.helpers';
import { convertToJsonDTO } from '../../../../api/json.dto.helpers';

@Component({
  selector: 'soer-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss'],
})
export class TemplateCreateComponent {
  public template$: Observable<TargetModel>;
  public isPublic = false;

  constructor(
    @Inject('template') private templateId: BusEmitter,
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private route: ActivatedRoute
  ) {
    this.template$ = deSerializeJson<TargetModel>(
      extractDtoPackFromBus<SerializedJsonModel>(this.store$.of(this.route.snapshot.data['target']))
    ).pipe(
      map<TargetModel[], TargetModel>((data) => {
        const [target] = data;
        return target ? target2template(target) : EMPTY_TARGET;
      })
    );
  }

  createTemplate(title: HTMLInputElement, block: HTMLTextAreaElement, template: TemplateModel): void {
    template.title = title.value;
    template.blocks = [{ text: block.value, type: 'markdown' }];

    this.bus$.publish(
      new CommandCreate(
        { ...this.templateId, key: { tid: 'new' } },
        { ...convertToJsonDTO(template, ['id']), accessTag: this.isPublic ? 'PUBLIC' : 'PRIVATE' },
        { skipRoute: true, skipInfo: true }
      )
    );
  }
}
