import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { FeedbackService } from '../../menu/feedback/services/feedback.service';
import { FeedbackAdminComponent } from './feedback-admin.component';

describe('FeedbackAdminComponent', () => {
  let component: FeedbackAdminComponent;
  let fixture: ComponentFixture<FeedbackAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackAdminComponent],
      providers: [
        {
          provide: FeedbackService,
          useValue: {
            getFeedback: () => of([[], 0]),
            getFeedbackCategories: () => of([]),
          },
        },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
