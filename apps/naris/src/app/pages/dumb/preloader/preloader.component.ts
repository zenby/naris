import { PreloaderService } from './../../../services/preloader.service';
import { Component } from '@angular/core';

@Component({
  selector: 'soer-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
})
export class PreloaderComponent {
  public isLoaderVisible$ = this.preloaderService.loadingAction$;

  constructor(public preloaderService: PreloaderService) {}
}
