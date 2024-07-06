import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { FeedService } from './services/feed.service';
import { MatPaginator } from '@angular/material/paginator';
import { tap, switchMap, retry, takeUntil, Subject } from 'rxjs';
import { TFeedItem, TPaginatedFeed } from './interfaces/paginated-feed.type';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit, OnDestroy {
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
          this.feedService.getFeed({
            skip: mp.pageIndex * mp.pageSize,
            take: mp.pageSize,
          })
        ),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.handleRanking());
  }

  public isLoading = false;
  public feed: TFeedItem[] = [];
  public length = 0;

  private readonly destroy$ = new Subject<void>();
  private mpReference: MatPaginator | null = null;

  constructor(
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly feedService: FeedService,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  ngOnInit(): void {
    this.pseudoStoreService.updatePseudoStore({
      activeMainscreen: 'feed',
      title: '',
    });

    this.feedService.getFeed().subscribe(this.handleRanking());
  }

  handleRanking() {
    return {
      next: ([feed, length]: TPaginatedFeed) => {
        this.isLoading = false;
        this.length = length;
        this.feed = feed;
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden des Feeds',
        });
      },
    };
  }

  ngOnDestroy(): void {
    this.pseudoStoreService.updatePseudoStore({ activeMainscreen: false });
  }
}
