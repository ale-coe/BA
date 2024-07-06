import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ICustomSnackbarData } from './custom-snackbar.typings';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss',
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: ICustomSnackbarData
  ) {}
}
