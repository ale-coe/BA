import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { TCoords } from '@shared/coords.type';
import * as L from 'leaflet';
import { Subject, filter, retry, switchMap, takeUntil, tap, timer } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { EMarkerType } from '../interfaces/marker-type.enum';
import { LandmarkService } from '../services/landmark.service';
import { PositionService } from '../services/position.service';
import { Marker } from './marker';
import { TooltipContentComponent } from './tooltip-content/tooltip-content.component';

@Directive({
  selector: '[appMapContainer]',
})
export class MapContainerDirective implements OnInit, OnDestroy {
  private tooltip = this.viewContainerRef.createComponent(
    TooltipContentComponent,
    {}
  );

  private destroy$ = new Subject<void>();
  private map!: L.Map;

  private ownPositionLayerGroup = L.layerGroup<Marker>();
  private landmarkLayerGroup = L.layerGroup<Marker>();
  private sharedPositionLayerGroup = L.layerGroup<Marker>();
  private eventLayerGroup = L.layerGroup<Marker>();

  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    private readonly landmarkService: LandmarkService,
    private readonly positionService: PositionService,
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  async ngOnInit() {
    await this.initMap();
    this.setTimerForOwnMarkerUpdate();
    this.setTimerForSharedPositionsUpdate();
    this.getLandmarks();
    this.getEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async initMap() {
    const mapContainer = this.elementRef.nativeElement;
    let center = await this.positionService.getCurrentPosition();

    if (!center) {
      center = [0, 0];

      this.customSnackbarService.showSnackbar('info', {
        message:
          'Standort konnte nicht ermittelt werden, bitte erlaube den Zugriff auf deinen Standort',
      });
    }

    this.map = L.map(mapContainer, {
      center,
      zoom: 11,
      zoomControl: false,
      layers: [
        this.ownPositionLayerGroup,
        this.landmarkLayerGroup,
        this.sharedPositionLayerGroup,
        this.eventLayerGroup,
      ],
    });

    this.map.addEventListener('contextmenu', (e) => {
      navigator.clipboard.writeText(
        JSON.stringify([e.latlng.lat, e.latlng.lng])
      );
      this.customSnackbarService.showSnackbar('info', {
        message: 'Koordinaten in die Zwischenablage kopiert',
      });
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    const overlays = {
      'Eigene Position': this.ownPositionLayerGroup,
      'Wichtige Orte': this.landmarkLayerGroup,
      'Andere Nutzer': this.sharedPositionLayerGroup,
      Events: this.eventLayerGroup,
    };
    const layerControl = L.control.layers(undefined, overlays);
    layerControl.addTo(this.map);

    document
      .querySelectorAll('.leaflet-control-layers-selector')
      .forEach((el, i) => {
        (el as HTMLElement).style.accentColor = `#${Marker.COLORS[i + 1]}`;
      });
  }

  setTimerForOwnMarkerUpdate() {
    timer(2_000, 20_000)
      .pipe(
        switchMap(() => this.pseudoStoreService.getSingleValue('coords')),
        filter((coords): coords is TCoords => !!coords),
        tap((coords) => this.setOwnMarker(coords)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  setTimerForSharedPositionsUpdate() {
    timer(2_000, 20_000)
      .pipe(
        switchMap(() => this.positionService.getSharedPositions()),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe((sharedPositions) => {
        // TODO_1: just clear those markers that are not in the new sharedPositions
        this.sharedPositionLayerGroup.clearLayers();

        for (const sharedPosition of sharedPositions) {
          const position = JSON.parse(
            sharedPosition.sharedByUser.position
          ) as TCoords;
          const marker = new Marker(position, EMarkerType.USER, this.tooltip, {
            profileImage: sharedPosition.sharedByUser.profileImage,
            text: `${
              sharedPosition.sharedByUser.username
                ? sharedPosition.sharedByUser.username
                : ''
            }${sharedPosition.sharedByUser.username ? ' ' : ''}
            ${
              sharedPosition.sharedByUser.city
                ? '(' + sharedPosition.sharedByUser.city + ')'
                : ''
            }`,
            loadingProfileImage: false,
            src: '',
          });
          marker.addTo(this.sharedPositionLayerGroup);
        }
      });
  }

  getLandmarks() {
    this.landmarkService
      .getLandmarks({ isEvent: 0, includeInactive: 0, take: 100, skip: 0 })
      .subscribe(([landmarks]) => {
        for (const landmark of landmarks) {
          const marker = new Marker(
            landmark.position,
            EMarkerType.POI,
            this.tooltip,
            {
              text: landmark.name,
              src: '',
              loadingProfileImage: false,
              profileImage: '',
            }
          );
          marker.addTo(this.landmarkLayerGroup);
        }
      });
  }

  getEvents() {
    this.landmarkService
      .getLandmarks({ isEvent: 1, includeInactive: 0, take: 100, skip: 0 })
      .subscribe(([landmarks]) => {
        for (const landmark of landmarks) {
          const marker = new Marker(
            landmark.position,
            EMarkerType.EVENT,
            this.tooltip,
            {
              text:
                landmark.name +
                (landmark.additionalInfo
                  ? ` (${landmark.additionalInfo})`
                  : ''),
              src: '',
              loadingProfileImage: false,
              profileImage: '',
            }
          );
          marker.addTo(this.eventLayerGroup);
        }
      });
  }

  async setOwnMarker(cords: TCoords) {
    if (this.ownPositionLayerGroup.getLayers().length) {
      (this.ownPositionLayerGroup.getLayers()[0] as Marker).setLatLng(cords);
      return;
    }

    const ownMarker = new Marker(cords, EMarkerType.OWN, this.tooltip, {
      src: '',
      profileImage: '',
      text: '',
      loadingProfileImage: false,
    });
    ownMarker.addTo(this.ownPositionLayerGroup);
  }
}
