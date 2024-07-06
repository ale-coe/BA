import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, retry, switchMap, take, takeUntil, tap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { AddRaffleDialogComponent } from './add-raffle-dialog/add-raffle-dialog.component';
import {
  IRaffle,
  TPaginatedRaffles,
} from './interfaces/paginated-raffles.type';
import { RaffleService } from './services/raffle.service';

// TODO_1: Fully implement the RaffleComponent
@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrl: './raffle.component.scss',
})
export class RaffleComponent {
  private readonly destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (!mp) return;

    mp.page
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(() => this.raffleService.getRaffles()),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.handleRaffles());
  }

  public isLoading = false;
  public length = 0;
  public raffles: IRaffle[] = [];
  public formArray = new FormArray<
    FormGroup<{ stopped: FormControl<boolean>; product: FormControl<string> }>
  >([]);

  constructor(
    private readonly raffleService: RaffleService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.raffleService.getRaffles().subscribe(this.handleRaffles());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleRaffles() {
    return {
      next: ([raffles, length]: TPaginatedRaffles) => {
        this.formArray.clear();
        this.isLoading = false;
        this.length = length;
        this.raffles = raffles;

        for (const trashImage of this.raffles) {
          this.formArray.push(
            new FormGroup({
              stopped: new FormControl(!trashImage.stopped, {
                nonNullable: true,
              }),
              product: new FormControl(
                { value: trashImage.product.name, disabled: true },
                {
                  nonNullable: true,
                }
              ),
            })
          );
        }
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden der Verlosungen ',
        });
      },
    };
  }

  addProduct() {
    this.matDialog
      .open(AddRaffleDialogComponent, {
        disableClose: true,
        width: '95vw',
        maxWidth: '600px',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap(() => this.raffleService.getRaffles())
      )
      .subscribe(this.handleRaffles());
  }
}
