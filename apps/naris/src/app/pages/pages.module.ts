import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { SrDTOModule } from '@soer/sr-dto';
import { VideoPlayerModule } from '@soer/soer-components';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { IconsProviderModule } from '../../icons-provider.module';
import { FilesListComponent } from './components/files-list/files-list.component';
import { DefaultComponent } from './default/default.component';
import { MobileMenuComponent } from './default/mobile-menu/mobile-menu.component';
import { DemoNgZorroAntdModule } from './demo.module';
import { DumbModule } from './dumb/dumb.module';
import { AbstracteModule } from './modules/abstracte/abstracte.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { ComposeVideoPlayerComponent } from './modules/compose-video-player/compose-video-player.component';
import { OverviewModule } from './modules/overview/overview.module';
import { EditorBlocksModule } from './modules/editor-blocks-module/editor-blocks.module';
import { PaymentModule } from './modules/payment/payment.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { RoadmapComponent } from './modules/roadmap/roadmap.component';
import { StreamsComponent } from './modules/streams/streams.component';
import { TargetsModule } from './modules/targets/targets.module';
import { PagesRoutingModule } from './pages-routing.module';
import { RouterComposeModule } from './router-compose/router-compose.module';

@NgModule({
  imports: [
    CommonModule,
    DumbModule,
    PagesRoutingModule,
    FormsModule,
    IconsProviderModule,
    DemoNgZorroAntdModule,
    YouTubePlayerModule,
    QuestionsModule,
    NzModalModule,
    TargetsModule,
    OverviewModule,
    EditorBlocksModule,
    AbstracteModule,
    PaymentModule,
    CertificateModule,
    SrDTOModule,
    NzModalModule,
    VideoPlayerModule,
  ],
  declarations: [
    MobileMenuComponent,
    DefaultComponent,
    StreamsComponent,
    RoadmapComponent,
    ComposeVideoPlayerComponent,
    FilesListComponent,
  ],
  exports: [RouterComposeModule],
})
export class PagesModule {}
