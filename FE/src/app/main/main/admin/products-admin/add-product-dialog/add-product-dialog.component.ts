import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IPostProductAttributes } from '@shared/post-product.attributes';
import { finalize, switchMap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { TImageSrc } from 'src/app/common/components/image/interfaces/profile-image-src.type';
import { ImagesService } from 'src/app/common/services/images.service';
import { ProductsService } from '../../../menu/product/services/products.service';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss',
})
export class AddProductDialogComponent {
  public productImage: TImageSrc = 'assets/loading.png';
  public isLoading = false;
  public formGroup = new FormGroup({
    imagePath: new FormControl('', { validators: [Validators.required] }),
    name: new FormControl('', { validators: [Validators.required] }),
    price: new FormControl(null, { validators: [Validators.required] }),
  });
  private file: File | null = null;

  constructor(
    private readonly imagesService: ImagesService,
    private readonly productsService: ProductsService,
    private readonly customSnackbarService: CustomSnackbarService,
    public dialogRef: MatDialogRef<AddProductDialogComponent>
  ) {}

  onFileChange(fileList: FileList | null) {
    const file = fileList?.item(0);

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.productImage = event!.target!.result as string;
      this.formGroup.patchValue({ imagePath: file.name }, { emitEvent: false });
    };

    reader.readAsDataURL(file);
    this.file = file;
  }

  addProduct() {
    this.isLoading = true;

    this.imagesService
      .uploadImage('productImage', this.file!)
      .pipe(
        switchMap((imagePath) => {
          const body: IPostProductAttributes = {
            imagePath,
            name: this.formGroup.get('name')!.value!,
            price: this.formGroup.get('price')!.value!,
          };
          return this.productsService.addProduct(body);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Produkt erfolgreich erstellt',
          });

          this.dialogRef.close();
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Erstellen des Produkts',
          });
        },
      });
  }
}
