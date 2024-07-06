import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ActivateUserService } from './services/activate-user.service';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrl: './activate-user.component.scss',
})
export class ActivateUserComponent {
  public isLoading = false;
  public formGroup = new FormGroup({
    activationCode: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly activateUserService: ActivateUserService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly router: Router
  ) {}

  activate() {
    this.isLoading = true;

    this.activateUserService
      .activateUser({
        activationCode: this.formGroup.controls.activationCode.value,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['main']);
        },
        error: () => {
          // TODO_1: specific ErrorMessage
          this.isLoading = false;
          this.formGroup.enable();
          this.customSnackbarService.showSnackbar('warn', {
            message:
              'Fehler beim Aktivieren, bitte versuche es in ein paar Minuten erneut',
          });
        },
      });
  }
}
