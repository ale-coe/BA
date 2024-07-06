import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PushNotificationComponent } from './push-notification.component';
import { PushNotificationService } from './services/push-notification.service';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PushnotificationComponent', () => {
  let component: PushNotificationComponent;
  let fixture: ComponentFixture<PushNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PushNotificationComponent],
      providers: [
        { provide: PushNotificationService, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PushNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
