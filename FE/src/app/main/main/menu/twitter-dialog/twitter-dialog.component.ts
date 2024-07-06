import { Component, OnInit } from '@angular/core';
import { TwitterService } from './services/twitter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize, of, switchMap } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';

@Component({
  selector: 'app-twitter-dialog',
  templateUrl: './twitter-dialog.component.html',
  styleUrl: './twitter-dialog.component.scss',
})
export class TwitterDialogComponent implements OnInit {
  public isLoading = false;

  public loadingAccount = true;

  public loginUrl = '';
  public tweetFormGroup = new FormGroup({
    tweet: new FormControl('', {
      validators: [Validators.required],
    }),
  });
  public connectFormGroup = new FormGroup({
    pin: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private readonly twitterService: TwitterService,
    private readonly matDialogRef: MatDialogRef<TwitterDialogComponent>,
    private readonly customSnackbarService: CustomSnackbarService
  ) {}

  ngOnInit(): void {
    // check if twitter account is connected
    this.twitterService
      .getAccountConnected()
      .pipe(
        switchMap((accountConnected) =>
          accountConnected === 'true'
            ? of(accountConnected)
            : this.twitterService.getLoginUrl()
        ),
        finalize(() => (this.loadingAccount = false))
      )
      .subscribe((result) => {
        if (result !== 'true') {
          this.loginUrl = result;
        }
      });
  }

  connectAccount() {
    this.loadingAccount = true;

    this.twitterService
      .postConnectAccount({ pin: this.connectFormGroup.getRawValue().pin! })
      .pipe(finalize(() => (this.loadingAccount = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message: 'Twitter Account erfolgreich verbunden!',
          });
          this.loginUrl = '';
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Twitter Account konnte nicht verbunden werden!',
          });
        },
      });
  }

  postTweet() {
    this.isLoading = true;

    this.twitterService
      .postTweet({
        tweet:
          this.tweetFormGroup.get('tweet')!.value! + ' #Cash4TrashAppOfficial',
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.customSnackbarService.showSnackbar('success', {
            message:
              'Tweet erfolgreich gepostet! Danke für deinen Einsatz, weiter so! Du erhältst 1 Punkt!',
          });
          this.matDialogRef.close();
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Tweet konnte nicht gepostet werden!',
          });
        },
      });
  }
}
