import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ProfileService } from '../services/profile.service';
import { IPositionShared } from './interfaces/position-shared.interface';
import { finalize } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-update-position-sharing-dialog',
  templateUrl: './update-position-sharing-dialog.component.html',
  styleUrl: './update-position-sharing-dialog.component.scss',
})
export class UpdatePositionSharingDialogComponent implements OnInit {
  public isLoading = false;
  public positionShared: IPositionShared[] = [];
  public selection = new SelectionModel<number>(true, []);

  public formControl = new FormControl(
    { value: '', disabled: false },
    { validators: [Validators.required, Validators.email], nonNullable: true }
  );

  constructor(
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService.getPositionShared().subscribe((positionShared) => {
      this.positionShared = positionShared;
    });
  }

  addUser() {
    this.isLoading = true;
    this.formControl.disable();

    this.profileService
      .postPositionShared({ email: this.formControl.value })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.formControl.enable();
        })
      )
      .subscribe({
        next: (positionShared) => {
          this.positionShared = positionShared;
          this.customSnackbarService.showSnackbar('success', {
            message: 'Position erfolgreich geteilt',
          });
          this.formControl.reset();
        },
        error: () => {
          // TODO: if duplicate -> show error message
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Position konnte nicht geteilt werden',
          });
        },
      });
  }

  deletePositionShared() {
    this.isLoading = true;
    this.profileService
      .deletePositionShared({ positionSharingIds: this.selection.selected })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.positionShared = this.positionShared.filter(
            (positionShared) =>
              !this.selection.selected.includes(
                positionShared.positionSharingId
              )
          );
          this.selection.clear();

          this.customSnackbarService.showSnackbar('success', {
            message: 'Deine Position wird nun nicht mehr geteilt',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Feher beim Löschen, bitte versuche es erneut',
          });
        },
      });
  }
}
