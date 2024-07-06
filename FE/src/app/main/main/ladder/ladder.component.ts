import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PointsService } from '../menu/product/services/points.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, tap, switchMap, retry, takeUntil } from 'rxjs';
import {
  IRanking,
  TPaginatedRanking,
} from './interfaces/paginated-ranking.interface';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrl: './ladder.component.scss',
})
export class LadderComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    // somehow ngIf in template leads to multiple calls of setter, therefore return is reference is already set
    if (this.mpReference) {
      return;
    }
    this.mpReference = mp;

    mp.page
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(() =>
          this.pointsService.getRanking({
            skip: mp.pageIndex * mp.pageSize,
            take: mp.pageSize,
          })
        ),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.handleRanking());
  }

  private readonly destroy$ = new Subject<void>();
  private mpReference: MatPaginator | null = null;

  public userId$ = this.pseudoStoreService.getSingleValue('userId');
  public yesterday = Date.now() - 86400000;
  public isLoading = false;
  public length = 0;
  public ranking: IRanking[] = [];

  constructor(
    private readonly pointsService: PointsService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly pseudoStoreService: PseudoStoreService
  ) {}

  ngOnInit() {
    this.pseudoStoreService.updatePseudoStore({
      title: '',
      activeMainscreen: 'ladder',
    });
    this.pointsService.getRanking().subscribe(this.handleRanking());
  }

  ngOnDestroy(): void {
    this.pseudoStoreService.updatePseudoStore({ activeMainscreen: false });
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleRanking() {
    return {
      next: ([ranking, length]: TPaginatedRanking) => {
        this.isLoading = false;
        this.length = length;
        this.ranking = ranking;
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden des Rankings',
        });
      },
    };
  }
}
