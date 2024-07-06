import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ProfileService } from '../../menu/profile/services/profile.service';
import { ProfileAdminComponent } from './profile-admin.component';

describe('ProfileAdminComponent', () => {
  let component: ProfileAdminComponent;
  let fixture: ComponentFixture<ProfileAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileAdminComponent],
      providers: [
        { provide: ProfileService, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatAutocompleteModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
