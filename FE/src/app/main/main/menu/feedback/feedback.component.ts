import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { IFeedbackType } from './interfaces/feeback-type.interface';
import { FeedbackService } from './services/feedback.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent implements OnInit {
  // https://github.com/angular/components/issues/4190#issuecomment-305031716
  @ViewChild('f') myNgForm!: NgForm;

  public isLoading = false;

  public feedbackTypes: IFeedbackType[] = [];
  public formGroup = new FormGroup({
    feedbackTypeId: new FormControl(
      { value: -1, disabled: true },
      { nonNullable: true, validators: [Validators.required] }
    ),
    text: new FormControl(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      }
    ),
  });

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly pseudoStoreService: PseudoStoreService
  ) {}

  ngOnInit(): void {
    this.getFeedbackTypes();
    this.pseudoStoreService.updatePseudoStore({ title: ' - Feedback' });
  }

  getFeedbackTypes() {
    this.feedbackService.getFeedbackTypes().subscribe((feedbackTypes) => {
      this.feedbackTypes = feedbackTypes;
      this.formGroup.patchValue({
        feedbackTypeId: feedbackTypes[0].feedbackTypeId,
      });

      this.formGroup.enable();
    });

    this.formGroup.errors;
  }

  sendFeedback() {
    this.formGroup.disable();
    this.isLoading = true;

    this.feedbackService
      .postFeedback({
        feedbackTypeId: this.formGroup.controls.feedbackTypeId.value,
        text: this.formGroup.controls.text.value,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message:
              'Vielen Dank, Feedback erfolgreich gesendet! Damit hilfst du uns, uns zu verbessern!',
          });

          this.myNgForm.resetForm({
            feedbackTypeId: this.feedbackTypes[0].feedbackTypeId,
          });

          this.formGroup.enable();
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Feedback senden fehlgeschlagen, bitte versuche es erneut',
          });
          this.formGroup.enable();
        },
      });
  }
}
