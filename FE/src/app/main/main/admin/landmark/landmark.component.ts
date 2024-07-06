import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, retry, switchMap, take, takeUntil, tap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { LandmarkService } from '../../home/services/landmark.service';
import { AddLandmarkDialogComponent } from './add-landmark-dialog/add-landmark-dialog.component';
import { ILandmark } from '../../home/interfaces/landmark.interface';
import { TPaginatedLandmarks } from './interfaces/paginated-landmarks.type';
import { ILandmarkType } from './add-landmark-dialog/interfaces/landmark-type.interface';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { IPutLandmarkAttributes } from '@shared/put-landmark.attributes';
import { IAddLandmarkDialogData } from './add-landmark-dialog/interfaces/add-landmark-dialog-data.interface';

@Component({
  selector: 'app-landmark',
  templateUrl: './landmark.component.html',
  styleUrl: './landmark.component.scss',
})
export class LandmarkComponent implements OnInit, OnDestroy {
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
          this.landmarkService.getLandmarks({
            isEvent: +this.isEvent,
            includeInactive: 1,
            take: mp.pageSize,
            skip: mp.pageIndex * mp.pageSize,
          })
        ),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.handleLandmarks());
  }
  @Input() isEvent = false;

  private readonly destroy$ = new Subject<void>();
  private mpReference: MatPaginator | null = null;

  public landmarks: ILandmark[] = [];
  public landmarkTypes: ILandmarkType[] = [];
  public isLoading = false;
  public length = 0;
  public formArray = new FormArray<
    FormGroup<{
      start: FormControl<Date | null>;
      end: FormControl<Date | null>;
    }>
  >([]);

  constructor(
    private readonly matDialog: MatDialog,
    private readonly landmarkService: LandmarkService,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  ngOnInit(): void {
    this.getLandmarkTypes();

    this.isLoading = true;
    this.landmarkService
      .getLandmarks({
        isEvent: +this.isEvent,
        includeInactive: 1,
        take: 10,
        skip: 0,
      })
      .subscribe(this.handleLandmarks());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addLandmark() {
    this.matDialog
      .open<AddLandmarkDialogComponent, IAddLandmarkDialogData, undefined>(
        AddLandmarkDialogComponent,
        {
          disableClose: true,
          width: '95vw',
          maxWidth: '600px',
          data: {
            landmarkTypes: this.landmarkTypes,
            isEvent: this.isEvent,
          },
        }
      )
      .afterClosed()
      .pipe(
        take(1),
        switchMap(() =>
          this.landmarkService.getLandmarks({
            isEvent: +this.isEvent,
            includeInactive: 1,
            take: 10,
            skip: 0,
          })
        )
      )
      .subscribe(this.handleLandmarks());
  }

  getLandmarkTypes() {
    this.landmarkService
      .getLandmarkTypes({ isEvent: +this.isEvent })
      .subscribe((landmarkTypes) => {
        this.landmarkTypes = landmarkTypes;
      });
  }

  handleLandmarks() {
    return {
      next: ([landmarks, length]: TPaginatedLandmarks) => {
        this.formArray.clear();

        this.isLoading = false;
        this.length = length;
        this.landmarks = landmarks;

        for (const landmark of this.landmarks) {
          this.formArray.push(
            new FormGroup({
              start: new FormControl(new Date(landmark.showFrom), {
                validators: [Validators.required],
              }),
              end: new FormControl(new Date(landmark.showUntil), {
                validators: [Validators.required],
              }),
            })
          );
        }
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden der wichtigen Orte',
        });
      },
    };
  }

  updateLandmark(index: number) {
    const body: IPutLandmarkAttributes = {
      landmarkId: this.landmarks[index].landmarkId,
      showFrom: this.formArray.at(index).get('start')!.value!.getTime(),
      showUntil: this.formArray.at(index).get('end')!.value!.getTime(),
    };

    this.landmarkService.updateLandmark(body).subscribe({
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
