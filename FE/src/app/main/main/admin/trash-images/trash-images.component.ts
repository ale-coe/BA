import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, finalize, retry, switchMap, takeUntil, tap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ImagesService } from 'src/app/common/services/images.service';
import {
  ITrashImage,
  TPaginatedTrashImages,
} from 'src/app/main/main/admin/trash-images/interfaces/paginated-trash-images.type';
import { TrashImageService } from './services/trash-image.service';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-trash-images',
  templateUrl: './trash-images.component.html',
  styleUrl: './trash-images.component.scss',
})
export class TrashImagesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (!mp) return;

    mp.page
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(() =>
          this.imageService.getImages('trashImage', {
            skip: mp.pageIndex * mp.pageSize,
            take: mp.pageSize,
          })
        ),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.handleTrashImages());
  }

  private readonly destroy$ = new Subject<void>();
  public trashImages: ITrashImage[] = [];
  public length = 0;
  public isLoading = false;
  public formArray = new FormArray<FormControl<boolean>>([]);

  constructor(
    private readonly imageService: ImagesService,
    private readonly trashImageService: TrashImageService,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.imageService
      .getImages('trashImage')
      .subscribe(this.handleTrashImages());
  }

  handleTrashImages() {
    return {
      next: ([trashImages, length]: TPaginatedTrashImages) => {
        this.formArray.clear();

        this.isLoading = false;
        this.length = length;
        this.trashImages = trashImages;

        for (const trashImage of this.trashImages) {
          this.formArray.push(
            new FormControl(!trashImage.hidden, { nonNullable: true })
          );
        }
      },
      error: () => {
        this.isLoading = false;
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Laden der Bilder',
        });
      },
    };
  }

  updateTrashImage(index: number) {
    this.isLoading = true;
    const { imageId } = this.trashImages[index];
    const hidden = +!this.formArray.at(index).value;

    this.trashImageService
      .updateTrashImage({ imageId, hidden })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Freigabe erfolgreich angepasst',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Freigabe konnte nicht angepasst werden',
          });
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
