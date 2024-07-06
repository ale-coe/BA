import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public isLoading = false;
  public formGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly router: Router
  ) {}

  login() {
    this.isLoading = true;
    this.formGroup.disable();

    this.authService
      .login({
        email: this.formGroup.controls.email.value,
        password: this.formGroup.controls.password.value,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['main']);
        },
        error: () => {
          // TODO_1: specific ErrorMessage if PW is not strong enough/Mail already exists
          this.isLoading = false;
          this.formGroup.enable();
          this.customSnackbarService.showSnackbar('warn', {
            message:
              'Fehler beim Anmelden, bitte versuche es in ein paar Minuten erneut',
          });
        },
      });
  }

  showContent(item: HTMLInputElement) {
    item.type = item.type === 'text' ? 'password' : 'text';
  }
}
