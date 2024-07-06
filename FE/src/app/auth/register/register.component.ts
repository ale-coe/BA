import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GMAIL_DOMAINS } from '@shared/constants';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public isLoading = false;
  public registered = false;
  public formGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly route: ActivatedRoute
  ) {}

  register() {
    if (
      GMAIL_DOMAINS.some((d) => this.formGroup.controls.email.value.endsWith(d))
    ) {
      this.customSnackbarService.showSnackbar('warn', {
        message: 'Bitte nutze die Anmeldemöglichkeit über Google',
      });
      return;
    }

    this.isLoading = true;
    this.formGroup.disable();

    this.authService
      .register({
        email: this.formGroup.controls.email.value,
        password: this.formGroup.controls.password.value,
        invitationCode: this.route.snapshot.queryParams['code'] || '',
      })
      .subscribe({
        next: () => {
          this.registered = true;
          this.customSnackbarService.showSnackbar('success', {
            message:
              'Erfolgreich registriert. Ein Aktivierungslink wurde an die angegebene Emailadresse verschickt.',
          });
        },
        error: (_err) => {
          // TODO_1: specific ErrorMessage if PW is not strong enough/Mail already exists
          this.isLoading = false;
          this.formGroup.enable();
          this.customSnackbarService.showSnackbar('warn', {
            message:
              'Fehler beim Registrieren, bitte versuche es in ein paar Minuten erneut',
          });
        },
      });
  }

  showContent(item: HTMLInputElement) {
    item.type = item.type === 'text' ? 'password' : 'text';
  }
}
