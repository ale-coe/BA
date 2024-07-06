import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EUserRoles } from '@shared/user-roles.enum';
import { debounceTime, filter, finalize, of, switchMap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { TImageSrc } from 'src/app/common/components/image/interfaces/profile-image-src.type';
import { IUser } from '../../menu/profile/interfaces/user.interface';
import { ProfileService } from '../../menu/profile/services/profile.service';
import { IPutUserProfileAttributes } from '@shared/put-user-profile.attributes';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrl: './profile-admin.component.scss',
})
export class ProfileAdminComponent {
  public profileImage: TImageSrc = 'assets/loading.png';
  public isLoading = false;
  public saving = false;
  public loadingProfileImage = false;
  public eUserTypes = EUserRoles;
  public userProfileId: number | undefined = undefined;

  public formControl = new FormControl('', { nonNullable: true });
  public options = this.formControl.valueChanges.pipe(
    filter((search) => typeof search === 'string'),
    debounceTime(100),
    switchMap((search) =>
      search ? this.profileService.getUser({ search }) : of([])
    )
  );

  public formGroup = new FormGroup({
    username: new FormControl({ value: '', disabled: false }),
    city: new FormControl({ value: '', disabled: false }),
    userRole: new FormControl<EUserRoles | undefined>({
      value: undefined,
      disabled: false,
    }),
    disabled: new FormControl({ value: false, disabled: false }),
  });

  constructor(
    private readonly profileService: ProfileService,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  displayFn(user: IUser): string {
    return user.email;
  }

  onSelectionChange(event: MatAutocompleteSelectedEvent) {
    this.userProfileId = undefined;
    this.isLoading = true;
    this.loadingProfileImage = true;

    this.profileService
      .getUserProfile(event.option.value.userId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (user) => {
          this.formGroup.setValue({
            city: user.city || '',
            username: user.username || '',
            userRole: user.userRole,
            disabled: !!user.disabled,
          });
          this.profileImage = user.profileImage
            ? [
                'assets/loading.png',
                'assets/profile-placeholder.webp',
                'profileImage',
                user.profileImage,
              ]
            : 'assets/profile-placeholder.webp';

          this.userProfileId = event.option.value.userId;
        },
        error: () => {
          // TODO_1: better error handling: user not found vs. admin user that cannot be edited
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Nutzer kann nicht bearbeitet werden',
          });
        },
      });
  }

  handleImageLoaded() {
    this.loadingProfileImage = false;
    this.saving = false;
  }

  resetValue(formControlName: string) {
    this.formGroup.get(formControlName)!.setValue('', { emitEvent: false });
  }

  updateUserProfile() {
    this.saving = true;

    const body: IPutUserProfileAttributes = {
      city: this.formGroup.get('city')!.value!,
      disabled: +this.formGroup.get('disabled')!.value!,
      userId: this.userProfileId!,
      username: this.formGroup.get('username')!.value!,
      userRole: this.formGroup.get('userRole')!.value!,
    };

    this.profileService
      .updateUserProfile(body, this.userProfileId!)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Profil wurde aktualisiert',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Profil konnte nicht aktualisiert werden',
          });
        },
      });
  }

  deleteProfileImage() {
    this.loadingProfileImage = true;
    this.saving = true;

    this.profileService
      .deleteProfileImage(this.userProfileId!)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Profilbild wurde gelöscht',
          });
          this.profileImage = 'assets/profile-placeholder.webp';
        },
        error: () => {
          this.loadingProfileImage = false;
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Profilbild konnte nicht gelöscht werden',
          });
        },
      });
  }
}
