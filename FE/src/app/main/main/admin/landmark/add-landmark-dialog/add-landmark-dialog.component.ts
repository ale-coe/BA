import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LandmarkService } from '../../../home/services/landmark.service';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAddLandmarkDialogData } from './interfaces/add-landmark-dialog-data.interface';
import { finalize } from 'rxjs';
import { IPostLandmarkAttributes } from '@shared/post-landmark.attrbutes';

@Component({
  selector: 'app-add-landmark-dialog',
  templateUrl: './add-landmark-dialog.component.html',
  styleUrl: './add-landmark-dialog.component.scss',
})
export class AddLandmarkDialogComponent {
  public formGroup = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    additionalInfo: new FormControl(
      { value: '', disabled: !this.data.isEvent },
      { nonNullable: true }
    ),
    landmarkTypeId: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    position: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    start: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    end: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public isLoading = false;

  constructor(
    private readonly landmarkService: LandmarkService,
    private readonly customSnackbarService: CustomSnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: IAddLandmarkDialogData,
    public dialogRef: MatDialogRef<AddLandmarkDialogComponent>
  ) {}

  addLandmark() {
    const landmark: IPostLandmarkAttributes = {
      additionalInfo: this.formGroup.getRawValue().additionalInfo,
      position: JSON.parse(this.formGroup.getRawValue().position),
      showFrom: this.formGroup.getRawValue().start.getTime(),
      showUntil: this.formGroup.getRawValue().end.getTime(),
      name: this.formGroup.getRawValue().name,
      landmarkType: {
        landmarkTypeId: this.formGroup.getRawValue().landmarkTypeId!,
      },
    };

    this.landmarkService
      .addLandmark(landmark)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Wichtiger Ort wurde erfolgreich hinzugefügt',
          });

          this.dialogRef.close();
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Hinzufügen des wichtigen Ortes',
          });
        },
      });
  }
}
