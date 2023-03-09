import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PreloaderComponent } from './preloader.component';
import { PreloaderService } from './preloader.service';

@NgModule({
  imports: [CommonModule, NzSpinModule],
  declarations: [PreloaderComponent],
  providers: [PreloaderService],
  exports: [PreloaderComponent],
})
export class PreloaderModule {}
