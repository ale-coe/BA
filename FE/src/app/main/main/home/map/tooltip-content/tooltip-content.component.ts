import { Component } from '@angular/core';
import { ITooltipContent } from './interfaces/tooltip-content.interface';
import { EMarkerType } from '../../interfaces/marker-type.enum';

@Component({
  selector: 'app-tooltip-content',
  templateUrl: './tooltip-content.component.html',
  styleUrl: './tooltip-content.component.scss',
})
export class TooltipContentComponent {
  public hidden = true;
  public showTooltip = false;
  public data!: ITooltipContent;
  public eMarkerType = EMarkerType;
  public type: EMarkerType | undefined = undefined;

  constructor() {
    this.reset();
  }

  handleImageLoaded() {
    this.data.loadingProfileImage = false;
  }

  reset() {
    this.showTooltip = false;
    this.data = {
      src: 'assets/loading.png',
      text: '',
      loadingProfileImage: true,
    };
  }
}
