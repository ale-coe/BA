import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SwPush } from '@angular/service-worker';
import { EUserRoles } from '@shared/user-roles.enum';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { PushNotificationService } from './admin/push-notification/services/push-notification.service';
import { PositionService } from './home/services/position.service';
import { MainComponent } from './main.component';
import { MatMenuModule } from '@angular/material/menu';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUserRole: () => of(EUserRoles.ADMIN),
            getUserId: () => of(1),
          },
        },
        { provide: CustomSnackbarService, useValue: { getImage: () => of() } },
        {
          provide: PseudoStoreService,
          useValue: {
            updatePseudoStore: () => of(),
            getSingleValue: () => of(''),
          },
        },
        {
          provide: PositionService,
          useValue: { getPositionShared: () => of(false) },
        },
        { provide: MatDialog, useValue: {} },
        {
          provide: SwPush,
          useValue: { requestSubscription: () => of({}) },
        },
        {
          provide: PushNotificationService,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatMenuModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
