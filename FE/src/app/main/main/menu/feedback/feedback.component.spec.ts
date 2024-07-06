import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { customMockPipeFactory } from 'src/app/common/pipes/mock.pipe';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { FeedbackComponent } from './feedback.component';
import { FeedbackService } from './services/feedback.service';
import { MatRadioModule } from '@angular/material/radio';

describe('FeebackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackComponent, customMockPipeFactory('formError')],
      providers: [
        {
          provide: PseudoStoreService,
          useValue: { updatePseudoStore: () => of() },
        },
        { provide: CustomSnackbarService, useValue: {} },
        {
          provide: FeedbackService,
          useValue: { getFeedbackTypes: () => of([]) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule, MatRadioModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
