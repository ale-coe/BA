import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSnackbarService } from '../common/components/custom-snackbar/custom-snackbar.service';
import { HealthService } from '../common/services/health.service';
import { PseudoStoreService } from '../common/services/pseudo-store.service';
import { OfflineComponent } from './offline.component';

describe('OfflineComponent', () => {
  let component: OfflineComponent;
  let fixture: ComponentFixture<OfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfflineComponent],
      providers: [
        { provide: HealthService, useValue: {} },
        { provide: PseudoStoreService, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
