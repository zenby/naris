import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FilesListComponent } from './files-list.component';

@NgModule({
  imports: [CommonModule, RouterModule, NzCardModule, NzTagModule, NzGridModule, NzIconModule],
  declarations: [FilesListComponent],
  exports: [FilesListComponent],
})
export class FilesListModule {}
