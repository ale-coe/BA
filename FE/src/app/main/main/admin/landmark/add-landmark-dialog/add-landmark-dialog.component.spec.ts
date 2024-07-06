import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { LandmarkService } from '../../../home/services/landmark.service';
import { AddLandmarkDialogComponent } from './add-landmark-dialog.component';

describe('AddLandmarkDialogComponent', () => {
  let component: AddLandmarkDialogComponent;
  let fixture: ComponentFixture<AddLandmarkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddLandmarkDialogComponent],
      providers: [
        { provide: LandmarkService, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddLandmarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
