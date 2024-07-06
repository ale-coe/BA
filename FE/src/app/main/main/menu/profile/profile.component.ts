import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, finalize, switchMap, takeUntil, tap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { ProfileService } from './services/profile.service';
import { UpdatePositionSharingDialogComponent } from './update-position-sharing-dialog/update-position-sharing-dialog.component';
import { ImagesService } from 'src/app/common/services/images.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public formGroup = new FormGroup({
    email: new FormControl(
      { value: '', disabled: true },
      { validators: [Validators.required, Validators.email], nonNullable: true }
    ),
    username: new FormControl(
      { value: '', disabled: true },
      { validators: [Validators.required], nonNullable: true }
    ),
    city: new FormControl(
      { value: '', disabled: true },
      { validators: [Validators.required], nonNullable: true }
    ),
  });
  public formControl = new FormControl(
    { value: false, disabled: true },
    { validators: [Validators.required], nonNullable: true }
  );
  public filePickerControl = new FormControl({ value: null, disabled: false });
  public isLoading = true;
  public saving = false;
  public loadingProfileImage = true;
  public profileImage: string | [string, string, string, string] =
    'assets/loading.png';

  constructor(
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly profileService: ProfileService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly matDialog: MatDialog,
    private readonly imagesService: ImagesService
  ) {}

  ngOnInit(): void {
    this.pseudoStoreService.updatePseudoStore({ title: ' - Profil' });
    this.profileService
      .getProfile()
      .subscribe(({ city, email, profileImage, showPosition, username }) => {
        this.profileImage = profileImage
          ? [
              'assets/loading.png',
              'assets/profile-placeholder.webp',
              'profileImage',
              profileImage,
            ]
          : 'assets/profile-placeholder.webp';

        this.isLoading = false;
        this.formGroup.setValue({ city, email, username });
        this.formGroup.enable();

        this.formControl.setValue(!!showPosition, { emitEvent: false });
        this.formControl.enable({ emitEvent: false });
      });

    this.formControl.valueChanges
      .pipe(
        tap(() => {
          this.formControl.disable({ emitEvent: false });
        }),
        switchMap((value) =>
          this.profileService.updateShowPosition({ showPosition: +value })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          const positionShared = !!this.formControl.value;
          this.pseudoStoreService.updatePseudoStore({ positionShared });
          this.formControl.enable({ emitEvent: false });

          this.customSnackbarService.showSnackbar('success', {
            message: positionShared
              ? 'Dein Standort wird nun geteilt'
              : 'Dein Standort wird nicht mehr geteilt',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Speichern, bitte versuche es erneut',
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save() {
    this.isLoading = true;
    this.saving = true;
    this.formGroup.disable();

    this.profileService
      .updateProfile({
        city: this.formGroup.controls.city.value,
        email: this.formGroup.controls.email.value,
        username: this.formGroup.controls.username.value,
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.saving = false;
          this.formGroup.enable();
        })
      )
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Profil erfolgreich aktualisiert',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Speichern, bitte versuche es erneut',
          });
        },
      });
  }

  onFileChange(fileList: FileList | null) {
    this.loadingProfileImage = true;
    this.isLoading = true;
    const file = fileList?.item(0);

    if (!file) return;

    this.imagesService.uploadImage('profileImage', file).subscribe({
      next: (profileImage) => {
        this.profileImage = [
          'assets/loading.png',
          'assets/profile-placeholder.webp',
          'profileImage',
          profileImage,
        ];

        this.customSnackbarService.showSnackbar('success', {
          message: 'Profilbild erfolgreich aktualisiert',
        });
      },
      error: () => {
        this.loadingProfileImage = false;
        this.isLoading = false;

        this.customSnackbarService.showSnackbar('warn', {
          message: 'Fehler beim Hochladen des Bilds, bitte versuche es erneut',
        });
      },
    });
  }

  handleImageLoaded() {
    this.isLoading = false;
    this.loadingProfileImage = false;
  }

  openUpdatePositionSharingDialog() {
    this.matDialog.open(UpdatePositionSharingDialogComponent, {
      width: '95vw',
      maxWidth: '100vw',
      disableClose: true,
      autoFocus: false,
    });
  }
}
