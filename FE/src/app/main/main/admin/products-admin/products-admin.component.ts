import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  Subject,
  finalize,
  retry,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import {
  IProduct,
  TPaginatedProducts,
} from '../../menu/product/interfaces/paginated-products.type';
import { ProductsService } from '../../menu/product/services/products.service';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrl: './products-admin.component.scss',
})
export class ProductsAdminComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (!mp) return;

    mp.page
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(() =>
          this.productsService.getProducts({
            skip: mp.pageIndex * mp.pageSize,
            take: mp.pageSize,
            includeHidden: 1,
          })
        ),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.handleProducts());
  }

  public isLoading = false;
  public length = 0;
  public products: IProduct[] = [];
  public formArray = new FormArray<FormControl<boolean>>([]);

  constructor(
    private readonly productsService: ProductsService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productsService
      .getProducts({
        includeHidden: 1,
        skip: 0,
        take: 10,
      })
      .subscribe(this.handleProducts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateProduct(index: number) {
    this.isLoading = true;
    const { productId } = this.products[index];
    const hidden = +!this.formArray.at(index).value;

    this.productsService
      .updateProduct({ productId, hidden })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Freigabe erfolgreich angepasst',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Freigabe konnte nicht angepasst werden',
          });
        },
      });
  }

  handleProducts() {
    return {
      next: ([products, length]: TPaginatedProducts) => {
        this.formArray.clear();
        this.isLoading = false;
        this.length = length;
        this.products = products;

        for (const trashImage of this.products) {
          this.formArray.push(
            new FormControl(!trashImage.hidden, { nonNullable: true })
          );
        }
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden der Produkte',
        });
      },
    };
  }

  addProduct() {
    this.matDialog
      .open(AddProductDialogComponent, {
        disableClose: true,
        width: '95vw',
        maxWidth: '600px',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap(() =>
          this.productsService.getProducts({
            includeHidden: 1,
            skip: 0,
            take: 10,
          })
        )
      )
      .subscribe(this.handleProducts());
  }
}
