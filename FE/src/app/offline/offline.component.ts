import { Component, OnDestroy, OnInit } from '@angular/core';
import { HealthService } from '../common/services/health.service';
import { Subject, filter, switchMap, takeUntil, timer } from 'rxjs';
import { PseudoStoreService } from '../common/services/pseudo-store.service';
import { Router } from '@angular/router';
import { CustomSnackbarService } from '../common/components/custom-snackbar/custom-snackbar.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrl: './offline.component.scss',
})
export class OfflineComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly healthService: HealthService,
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly router: Router,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  ngOnInit(): void {
    timer(5_000, 10_000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.healthService.getHealth()),
        filter((online) => online)
      )
      .subscribe((online) => {
        this.pseudoStoreService.updatePseudoStore({ online });
        this.customSnackbarService.showSnackbar('success', {
          message: 'Du bist wieder online!',
        });
        this.router.navigate(['/']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
