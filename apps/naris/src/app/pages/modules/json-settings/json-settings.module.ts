import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DocumentSettingsComponent } from './document-settings/document-settings.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DocumentSettingsComponent],
  exports: [DocumentSettingsComponent],
})
export class JsonSettingsModule {}
