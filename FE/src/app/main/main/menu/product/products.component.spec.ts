import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { ProductsComponent } from './products.component';
import { PointsService } from './services/points.service';
import { ProductsService } from './services/products.service';

describe('ProductComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      providers: [
        { provide: CustomSnackbarService, useValue: {} },
        {
          provide: PseudoStoreService,
          useValue: { updatePseudoStore: () => of() },
        },
        {
          provide: ProductsService,
          useValue: { getProducts: () => of([[], 0]) },
        },
        {
          provide: PointsService,
          useValue: { getCurrentBalance: () => of(1) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
