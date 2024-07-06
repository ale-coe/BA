import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, finalize, retry, switchMap, takeUntil, tap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { FeedbackService } from '../../menu/feedback/services/feedback.service';
import {
  IFeedback,
  TPaginatedFeedback,
} from './interfaces/paginated-feedback.type';
import { IFeedbackCategory } from '../../menu/feedback/interfaces/feeback-category.interface';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { IPutFeedbackAttribute } from '@shared/put-feedback.attributes';

@Component({
  selector: 'app-feedback-admin',
  templateUrl: './feedback-admin.component.html',
  styleUrl: './feedback-admin.component.scss',
})
export class FeedbackAdminComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (!mp) return;

    mp.page
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(() =>
          this.feedbackService.getFeedback({
            skip: mp.pageIndex * mp.pageSize,
            take: mp.pageSize,
          })
        ),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.handleFeedback());
  }

  private readonly destroy$ = new Subject<void>();
  public feedback: IFeedback[] = [];
  public categories: IFeedbackCategory[] = [];
  public length = 0;
  public isLoading = false;
  public formArray = new FormArray<FormControl<number | null>>([]);

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  ngOnInit(): void {
    this.feedbackService.getFeedback().subscribe(this.handleFeedback());

    this.feedbackService.getFeedbackCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleFeedback() {
    return {
      next: ([feedback, length]: TPaginatedFeedback) => {
        this.formArray.clear();

        this.isLoading = false;
        this.length = length;
        this.feedback = feedback;

        for (const _feedback of feedback) {
          this.formArray.push(
            new FormControl<number | null>(
              _feedback.feedbackCategory?.feedbackCategoryId ?? null,
              {
                validators: [Validators.required],
              }
            )
          );
        }
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden des Feedbacks',
        });
      },
    };
  }

  updateFeedback(index: number) {
    this.isLoading = true;

    const updatedFeedack: IPutFeedbackAttribute = {
      feedbackId: this.feedback[index].feedbackId,
      feedbackCategory: { feedbackCategoryId: this.formArray.at(index).value! },
    };

    this.feedbackService
      .updateFeedback(updatedFeedack)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Daten erfolgreich gespeichert',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Speichern der Daten',
          });
        },
      });
  }
}
