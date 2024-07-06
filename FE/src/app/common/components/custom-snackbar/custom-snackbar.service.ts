import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar.component';
import {
  ICustomSnackbarData,
  TCustomSnackbarType,
} from './custom-snackbar.typings';

@Injectable({
  providedIn: 'root',
})
export class CustomSnackbarService {
  constructor(private readonly matSnackBar: MatSnackBar) {}

  showSnackbar(type: TCustomSnackbarType, data: ICustomSnackbarData) {
    this.matSnackBar.openFromComponent(CustomSnackbarComponent, {
      horizontalPosition: 'right',
      panelClass: ['pop-up', type],
      data,
      duration: 6000,
    });
  }
}
