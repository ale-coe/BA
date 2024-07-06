import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { InviteFriendService } from './services/invite-friend.service';

@Component({
  selector: 'app-invite-friend-dialog',
  templateUrl: './invite-friend-dialog.component.html',
  styleUrl: './invite-friend-dialog.component.scss',
})
export class InviteFriendDialogComponent {
  public isLoading = false;
  public formControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  constructor(
    private readonly inviteFriendService: InviteFriendService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly dialogRef: MatDialogRef<InviteFriendDialogComponent>
  ) {}

  inviteFriend() {
    this.isLoading = true;
    this.formControl.disable();

    this.inviteFriendService
      .inviteFriend({
        email: this.formControl.value,
        invitationDate: Date.now(),
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Freund erfolgreich eingeladen.',
          });
          this.dialogRef.close();
        },
        error: () => {
          this.formControl.enable();
          this.customSnackbarService.showSnackbar('warn', {
            message:
              'Fehler beim Einladen des Freundes. Bitte versuche es erneut.',
          });
        },
      });
  }
}
