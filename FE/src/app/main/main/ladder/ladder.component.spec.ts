import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { PointsService } from '../menu/product/services/points.service';
import { LadderComponent } from './ladder.component';

describe('LadderComponent', () => {
  let component: LadderComponent;
  let fixture: ComponentFixture<LadderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LadderComponent],
      providers: [
        {
          provide: PointsService,
          useValue: {
            getRanking: () => of([[], 0]),
          },
        },
        {
          provide: PseudoStoreService,
          useValue: {
            updatePseudoStore: () => of(),
            getSingleValue: () => of(''),
          },
        },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LadderComponent);
    component = fixture.componentInstance;
    component.matPaginator = { page: of() } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
