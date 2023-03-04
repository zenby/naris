import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilesListModule } from '@soer/soer-components';
import { SourcesComponent } from './sources.component';

@NgModule({
  imports: [FilesListModule, CommonModule],
  declarations: [SourcesComponent],
  exports: [SourcesComponent],
})
export class SourcesModule {}
