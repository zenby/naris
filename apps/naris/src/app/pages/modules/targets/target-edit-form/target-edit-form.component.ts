import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { convertToJsonDTO } from '../../../../api/json.dto.helpers';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { CommandCreate, CommandUpdate, DataStoreService } from '@soer/sr-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'soer-target-edit-form',
  templateUrl: './target-edit-form.component.html',
  styleUrls: ['./target-edit-form.component.scss'],
})
export class TargetEditFormComponent implements AfterViewInit {
  @Input() title = '';
  @Input() overview = '';
  @ViewChild('titleElem') titleElem: any;

  log = console.log;
  form: UntypedFormGroup;
  constructor(
    @Inject('target') private targetId: BusEmitter,
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      id: [null],
      title: ['', [Validators.required, Validators.maxLength(140)]],
      overview: ['', [Validators.maxLength(512)]],
      progress: 0,
      tasks: [[]],
    });
  }

  ngAfterViewInit(): void {
    this.titleElem.nativeElement.focus();
  }

  onSubmit(): void {
    if (this.form.value.id === null) {
      this.bus$.publish(
        new CommandCreate({ ...this.targetId, key: { tid: 'new' } }, convertToJsonDTO(this.form.value, ['id']), {
          afterCommandDoneRedirectTo: this.route.snapshot.data['afterCommandDoneRedirectTo'],
          skipInfo: true,
        })
      );
    } else {
      this.bus$.publish(
        new CommandUpdate(this.targetId, { ...convertToJsonDTO(this.form.value, ['id']), id: this.form.value.id })
      );
    }
  }
}
