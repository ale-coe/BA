import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ActivateUserComponent } from './activate-user.component';
import { ActivateUserService } from './services/activate-user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ActivateUserComponent', () => {
  let component: ActivateUserComponent;
  let fixture: ComponentFixture<ActivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivateUserComponent],
      providers: [
        { provide: ActivateUserService, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
