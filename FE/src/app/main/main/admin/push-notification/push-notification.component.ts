import { Component, ViewChild } from '@angular/core';
import { PushNotificationService } from './services/push-notification.service';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { finalize } from 'rxjs';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrl: './push-notification.component.scss',
})
export class PushNotificationComponent {
  // https://github.com/angular/components/issues/4190#issuecomment-305031716
  @ViewChild('f') myNgForm!: NgForm;

  public targetUrls = ['main/ladder', 'main/feed', 'main/products'];

  public formGroup = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    body: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    url: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  public isLoading = false;

  constructor(
    private readonly pushNotificationService: PushNotificationService,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  sendNotification() {
    this.isLoading = true;
    this.formGroup.disable();
    const { body, title, url } = this.formGroup.getRawValue();

    this.pushNotificationService
      .sendNotification({
        body,
        title,
        url,
      })
      .pipe(
        finalize(() => {
          this.formGroup.enable();
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.myNgForm.resetForm({
            title: '',
          });

          this.customSnackbarService.showSnackbar('success', {
            message: 'Benachrichtigung erfolgreich gesendet',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Senden der Benachrichtigung',
          });
        },
      });
  }
}
