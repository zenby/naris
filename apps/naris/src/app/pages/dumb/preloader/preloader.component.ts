import { Component } from '@angular/core';
import { PreloaderService } from './../../../services/preloader.service';

@Component({
  selector: 'soer-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
})
export class PreloaderComponent {
  public isLoaderVisible$ = this.preloaderService.loadingAction$;

  constructor(public preloaderService: PreloaderService) {}
}
