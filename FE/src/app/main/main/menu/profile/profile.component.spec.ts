import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ImagesService } from 'src/app/common/services/images.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './services/profile.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        {
          provide: PseudoStoreService,
          useValue: { updatePseudoStore: () => of() },
        },
        { provide: ProfileService, useValue: { getProfile: () => of({}) } },
        { provide: CustomSnackbarService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: ImagesService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
