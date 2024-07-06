import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { IProduct } from '../../../menu/product/interfaces/paginated-products.type';

@Component({
  selector: 'app-add-raffle-dialog',
  templateUrl: './add-raffle-dialog.component.html',
  styleUrl: './add-raffle-dialog.component.scss',
})
export class AddRaffleDialogComponent {
  public isLoading = false;
  public formGroup = new FormGroup({
    imagePath: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
    productId: new FormControl(null, { validators: [Validators.required] }),
    start: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    end: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  public products: IProduct[] = [];

  constructor(
    private readonly customSnackbarService: CustomSnackbarService,
    public dialogRef: MatDialogRef<AddRaffleDialogComponent>
  ) {}

  addProduct() {
    this.isLoading = true;

    this.customSnackbarService.showSnackbar('success', {
      message: 'Verlosung erfolgreich erstellt',
    });
    this.dialogRef.close();

    this.isLoading = false;
  }
}
