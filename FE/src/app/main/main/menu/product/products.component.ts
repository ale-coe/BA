import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, finalize, retry, switchMap, takeUntil, tap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import {
  IProduct,
  TPaginatedProducts,
} from './interfaces/paginated-products.type';
import { ProductsService } from './services/products.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { IPostBuyProductAttributes } from '@shared/post-buy-product.attributes';
import { PointsService } from './services/points.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
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
            includeHidden: 0,
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
  // TODO_1: if error show error message
  public points: number | null = null;

  constructor(
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly productsService: ProductsService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly pointsService: PointsService
  ) {}

  ngOnInit(): void {
    this.pseudoStoreService.updatePseudoStore({ title: ' - Produkte' });
    this.productsService
      .getProducts({
        includeHidden: 0,
        skip: 0,
        take: 10,
      })
      .subscribe(this.handleProducts());

    this.pointsService.getCurrentBalance().subscribe({
      next: (points) => {
        this.points = points;
      },
      error: () => {
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden der Punkte',
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleProducts() {
    return {
      next: ([products, length]: TPaginatedProducts) => {
        this.isLoading = false;
        this.length = length;
        this.products = products;
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden der Produkte',
        });
      },
    };
  }

  buyProduct(index: number) {
    this.isLoading = true;

    const { productId } = this.products[index];

    const body: IPostBuyProductAttributes = {
      productId,
      date: Date.now(),
    };

    this.productsService
      .buyProduct(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (points) => {
          this.points = points;
          this.customSnackbarService.showSnackbar('success', {
            message: 'Produkt gekauft, du erhälst den Gutscheincode per Email',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Kauf des Produkts, bitte versuche es erneut',
          });
        },
      });
  }
}
