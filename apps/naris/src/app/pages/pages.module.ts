import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { SrDTOModule } from '@soer/sr-dto';
import { AccessDeniedModule, DemoNgZorroAntdModule, OverlayModule, VideoPlayerModule } from '@soer/soer-components';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { IconsProviderModule } from '../../icons-provider.module';
import { DefaultComponent } from './default/default.component';
import { MobileMenuComponent } from './default/mobile-menu/mobile-menu.component';
import { AbstracteModule } from './modules/abstracte/abstracte.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { ComposeVideoPlayerComponent } from './modules/compose-video-player/compose-video-player.component';
import { OverviewModule } from './modules/overview/overview.module';
import { PaymentModule } from './modules/payment/payment.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { RoadmapComponent } from './modules/roadmap/roadmap.component';
import { StreamsComponent } from './modules/streams/streams.component';
import { TargetsModule } from './modules/targets/targets.module';
import { PagesRoutingModule } from './pages-routing.module';
import { RouterComposeModule } from './router-compose/router-compose.module';
import { EditorBlocksModule } from './modules/editor-blocks/editor-blocks.module';
import { AccountPageModule } from './modules/account-page/account-page.module';
import { SourcesModule } from './modules/sources/sources.module';

@NgModule({
  imports: [
    CommonModule,
    AccessDeniedModule,
    PagesRoutingModule,
    FormsModule,
    IconsProviderModule,
    DemoNgZorroAntdModule,
    YouTubePlayerModule,
    QuestionsModule,
    NzModalModule,
    TargetsModule,
    OverviewModule,
    AbstracteModule,
    PaymentModule,
    EditorBlocksModule,
    CertificateModule,
    SrDTOModule,
    NzModalModule,
    VideoPlayerModule,
    AccountPageModule,
    SourcesModule,
    OverlayModule,
  ],
  declarations: [
    MobileMenuComponent,
    DefaultComponent,
    StreamsComponent,
    RoadmapComponent,
    ComposeVideoPlayerComponent,
  ],
  exports: [RouterComposeModule],
})
export class PagesModule {}
