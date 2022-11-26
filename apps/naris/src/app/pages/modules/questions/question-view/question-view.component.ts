import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter, BusMessage } from '@soer/mixed-bus';
import { DataStoreService } from '@soer/sr-dto';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { QuestionModel } from '../../../../api/questions/question.model';
import { QuestionsConfigService } from '../services/questions-config.service';

@Component({
  selector: 'soer-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss'],
})
export class QuestionViewComponent {
  public readonly hostUrl = environment.host;
  public question$: Observable<QuestionModel[]>;
  public audioSpeed = this.questionsControlService.getAudioPlayerSpeed();
  private questionId: BusEmitter;

  constructor(
    private store$: DataStoreService,
    private route: ActivatedRoute,
    private questionsControlService: QuestionsConfigService
  ) {
    this.questionId = this.route.snapshot.data['question'];
    this.question$ = this.store$.of(this.questionId).pipe(
      map<BusMessage, QuestionModel[]>((data: BusMessage | null) => {
        return data?.payload?.items ?? [];
      })
    );
  }

  changeAudioSpeed(speed: number): void {
    this.questionsControlService.setAudioPlayerSpeed(speed);
  }
}
