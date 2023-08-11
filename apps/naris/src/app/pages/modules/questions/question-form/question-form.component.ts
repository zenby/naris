import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ANY_SERVICE, BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { CommandCreate, CommandUpdate } from '@soer/sr-dto';

import { convertToJsonDTO } from '../../../../api/json.dto.helpers';
import { QuestionAskedEvent } from '../events/question-asked.event';

@Component({
  selector: 'soer-question-form',
  templateUrl: './question-form.component.html',
})
export class QuestionFormComponent {
  @Output() submitForm: EventEmitter<SubmitEvent> = new EventEmitter();
  form: UntypedFormGroup;

  questionMaxLength = 1500;

  constructor(
    @Inject('question') private questionIdEmitter: BusEmitter,
    private bus$: MixedBusService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'save') {
        this.onSubmit();
      }
    });
    this.form = this.formBuilder.group({
      id: [null],
      question: [null, [Validators.maxLength(this.questionMaxLength), Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.isFormInvalid()) return;

    const questionCommand =
      this.form.value.id === null
        ? new CommandCreate(this.questionIdEmitter, this.form.value, { afterCommandDoneRedirectTo: ['.'] })
        : new CommandUpdate(this.questionIdEmitter, {
            ...convertToJsonDTO(this.form.value, ['id']),
            id: this.form.value.id,
          });

    this.bus$.publish(questionCommand);
    this.bus$.publish(new QuestionAskedEvent(ANY_SERVICE, this.form.value));
  }

  private isFormInvalid(): boolean {
    this.form?.get('question')?.markAsDirty();
    this.form?.get('question')?.updateValueAndValidity();
    return this.form.invalid;
  }
}
