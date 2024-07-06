import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ImagesService } from 'src/app/common/services/images.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { PointsService } from '../menu/product/services/points.service';
import { HomeComponent } from './home.component';
import { LandmarkService } from './services/landmark.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        {
          provide: PseudoStoreService,
          useValue: { updatePseudoStore: () => of() },
        },
        { provide: ImagesService, useValue: {} },
        {
          provide: CustomSnackbarService,
          useValue: { showSnackbar: () => {} },
        },
        {
          provide: PointsService,
          useValue: { getCurrentMonthsPoints: () => of(1) },
        },
        {
          provide: LandmarkService,
          useValue: { getLandmarks: () => of([[]]) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
