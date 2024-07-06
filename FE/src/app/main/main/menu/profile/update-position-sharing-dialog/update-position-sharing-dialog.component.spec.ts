import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { customMockPipeFactory } from 'src/app/common/pipes/mock.pipe';
import { ProfileService } from '../services/profile.service';
import { UpdatePositionSharingDialogComponent } from './update-position-sharing-dialog.component';

describe('UpdatePositionSharingDialogComponent', () => {
  let component: UpdatePositionSharingDialogComponent;
  let fixture: ComponentFixture<UpdatePositionSharingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UpdatePositionSharingDialogComponent,
        customMockPipeFactory('formError'),
      ],
      providers: [
        { provide: CustomSnackbarService, useValue: {} },
        {
          provide: ProfileService,
          useValue: { getPositionShared: () => of([]) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePositionSharingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
