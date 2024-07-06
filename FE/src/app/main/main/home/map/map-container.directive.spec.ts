import { ElementRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { LandmarkService } from '../services/landmark.service';
import { PositionService } from '../services/position.service';
import { MapContainerDirective } from './map-container.directive';

describe('MapContainerDirective', () => {
  let directive: MapContainerDirective;
  let landmarkService: LandmarkService;
  let positionService: PositionService;
  let pseudoStoreService: PseudoStoreService;
  let viewContainerRef: ViewContainerRef;
  let customSnackbarService: CustomSnackbarService;
  let elementRef: ElementRef<HTMLDivElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapContainerDirective],
      providers: [
        {
          provide: LandmarkService,
          useValue: { getLandmarks: () => of([[], 0]) },
        },
        { provide: PositionService, useValue: {} },
        { provide: PseudoStoreService, useValue: {} },
        { provide: ViewContainerRef, useValue: { createComponent: () => {} } },
        { provide: CustomSnackbarService, useValue: {} },
        { provide: ElementRef, useValue: { nativeElement: undefined } },
      ],
    }).compileComponents();

    landmarkService = TestBed.inject(LandmarkService);
    positionService = TestBed.inject(PositionService);
    pseudoStoreService = TestBed.inject(PseudoStoreService);
    viewContainerRef = TestBed.inject(ViewContainerRef);
    customSnackbarService = TestBed.inject(CustomSnackbarService);
    elementRef = TestBed.inject(ElementRef);

    directive = new MapContainerDirective(
      elementRef,
      landmarkService,
      positionService,
      pseudoStoreService,
      viewContainerRef,
      customSnackbarService
    );
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
