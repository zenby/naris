import { Component, Input } from "@angular/core";
import { TileModel } from "./tile.model";


@Component({
    selector: 'soer-tile',
    templateUrl: 'tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
  @Input() tile: TileModel | null = null;

  constructor() {}
}
