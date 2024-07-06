import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { LandmarkService } from '../../home/services/landmark.service';
import { LandmarkComponent } from './landmark.component';

describe('LandmarkComponent', () => {
  let component: LandmarkComponent;
  let fixture: ComponentFixture<LandmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandmarkComponent],
      providers: [
        {
          provide: LandmarkService,
          useValue: {
            getLandmarks: () => of([[], 0]),
            getLandmarkTypes: () => of([]),
          },
        },
        { provide: MatDialog, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LandmarkComponent);
    component = fixture.componentInstance;
    component.matPaginator = { page: of() } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
