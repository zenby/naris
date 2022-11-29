import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { QuestionFormComponent } from './question-form/question-form.component';
import { QuestionRulesComponent } from './question-rules/question-rules.component';
import { DumbModule } from '../../dumb/dumb.module';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { RouterModule } from '@angular/router';
import { ListQuestionsPageComponent } from './list-questions-page/list-questions-page.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FileExtensionPipe } from './file-extension.pipe';
import { YtFromUrlPipe } from './yt-from-url.pipe';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { QuestionViewComponent } from './question-view/question-view.component';
import { OnlyWithAnaswerPipe } from './only-with-anaswer.pipe';
import { QuestionsConfigService } from './services/questions-config.service';
import { AudioPlayerModule } from '@soer/soer-components';

@NgModule({
  declarations: [
    QuestionFormComponent,
    QuestionRulesComponent,
    ListQuestionsPageComponent,
    QuestionViewComponent,
    FileExtensionPipe,
    YtFromUrlPipe,
    OnlyWithAnaswerPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzLayoutModule,
    NzGridModule,
    NzStatisticModule,
    NzDescriptionsModule,
    NzTimelineModule,
    NzProgressModule,
    NzBadgeModule,
    NzResultModule,
    NzIconModule,
    NzMessageModule,
    NzDrawerModule,
    NzTabsModule,
    DumbModule,
    RouterModule,
    NzListModule,
    NzTypographyModule,
    NzToolTipModule,
    AudioPlayerModule,
  ],
  providers: [QuestionsConfigService],
  exports: [QuestionFormComponent],
})
export class QuestionsModule {}
