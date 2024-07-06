import { ComponentRef } from '@angular/core';
import * as L from 'leaflet';
import { EMarkerType } from '../interfaces/marker-type.enum';
import { TooltipContentComponent } from './tooltip-content/tooltip-content.component';
import { delay, tap, timer } from 'rxjs';
import { ITooltipContent } from './tooltip-content/interfaces/tooltip-content.interface';
import { ITooltipData } from './interfaces/tooltip-data.interface';

export class Marker extends L.Marker {
  // EMarkerType starts from 1
  static COLORS = [null, 'ec1c24', '00b5fc', '12ac26', 'ff9f00'];

  constructor(
    position: L.LatLngExpression,
    private markerType: EMarkerType,
    private tooltip: ComponentRef<TooltipContentComponent>,
    private additionalData: ITooltipData
  ) {
    super(position);
    this.setCustomIcon();
    this.addEventListener('click', this.showCustomPopUp);
    this.bindPopup(this.tooltip.location.nativeElement);
  }

  setCustomIcon() {
    const icon = new L.Icon({
      iconUrl: `assets/custom-marker/${Marker.COLORS[this.markerType]}.png`,
      shadowUrl: 'assets/custom-marker/shadow.png',
    });

    this.setIcon(icon);
  }

  showCustomPopUp() {
    this.tooltip.instance.hidden = false;
    this.tooltip.instance.reset();

    switch (this.markerType) {
      case EMarkerType.OWN:
        this.updateTooltipContentWrapper({
          src: '',
          text: '',
          loadingProfileImage: false,
        });
        break;
      case EMarkerType.EVENT:
        this.updateTooltipContentWrapper({
          src: '',
          text: this.additionalData.text,
          loadingProfileImage: false,
        });
        break;
      case EMarkerType.POI:
        this.updateTooltipContentWrapper({
          src: '',
          text: this.additionalData.text,
          loadingProfileImage: false,
        });
        break;
      case EMarkerType.USER:
        this.updateTooltipContentWrapper({
          src: [
            'assets/loading.png',
            'assets/profile-placeholder.webp',
            'profileImage',
            this.additionalData.profileImage,
          ],
          text: this.additionalData.text,
          loadingProfileImage: true,
        });
        break;
    }
  }

  updateTooltipContentWrapper(data: ITooltipContent) {
    timer(0)
      .pipe(
        tap(() => (this.tooltip.instance.type = this.markerType)),
        delay(10)
      )
      .subscribe(() => {
        this.tooltip.instance.data = data;
      });
  }
}
