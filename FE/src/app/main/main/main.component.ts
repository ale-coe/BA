import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { TCoords } from '@shared/coords.type';
import { IPostNotificationSubscriptionAttributes } from '@shared/post-notification-id.attributes';
import { EUserRoles } from '@shared/user-roles.enum';
import {
  Subject,
  filter,
  from,
  map,
  retry,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { environment } from 'src/environments/environment';
import { PushNotificationService } from './admin/push-notification/services/push-notification.service';
import { PositionService } from './home/services/position.service';
import { InviteFriendDialogComponent } from './menu/invite-friend-dialog/invite-friend-dialog.component';
import { PointCollectionDialogComponent } from './menu/point-collection-dialog/point-collection-dialog.component';
import { PrivacyComponent } from './menu/privacy/privacy.component';
import { TwitterDialogComponent } from './menu/twitter-dialog/twitter-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public title$ = this.pseudoStoreService.getSingleValue('title');
  public isAdmin$ = this.pseudoStoreService
    .getSingleValue('userRole')
    .pipe(map((role) => role === EUserRoles.ADMIN));
  public activeMainscreen$ =
    this.pseudoStoreService.getSingleValue('activeMainscreen');

  constructor(
    private readonly authService: AuthService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly router: Router,
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly positionService: PositionService,
    private readonly matDialog: MatDialog,
    private readonly swPush: SwPush,
    private readonly pushNotificationService: PushNotificationService
  ) {}

  ngOnInit(): void {
    this.positionService
      .getPositionShared()
      .subscribe((positionShared) =>
        this.pseudoStoreService.updatePseudoStore({ positionShared })
      );

    this.authService
      .getUserRole()
      .subscribe((userRole) =>
        this.pseudoStoreService.updatePseudoStore({ userRole })
      );

    this.authService
      .getUserId()
      .subscribe((userId) =>
        this.pseudoStoreService.updatePseudoStore({ userId })
      );

    this.updateCoords();
    this.setNotificationId();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setNotificationId() {
    timer(10_000)
      .pipe(
        filter(() => this.swPush.isEnabled),
        switchMap(() =>
          this.swPush.requestSubscription({
            serverPublicKey: environment.publicKey,
          })
        ),
        switchMap((pushSubscription) =>
          this.pushNotificationService.setNotificationSubscription(
            pushSubscription.toJSON() as unknown as IPostNotificationSubscriptionAttributes
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Push-Nachrichten konnten nicht aktiviert werden',
          });
        },
      });
  }

  updateCoords() {
    timer(2_000, 20_000)
      .pipe(
        switchMap(() => from(this.positionService.getCurrentPosition())),
        filter((coords): coords is TCoords => !!coords),
        tap((coords) => this.pseudoStoreService.updatePseudoStore({ coords })),
        switchMap(() =>
          this.pseudoStoreService.getSingleValue('positionShared').pipe(take(1))
        ),
        filter((positionShared) => !!positionShared),
        switchMap(() =>
          this.pseudoStoreService.getSingleValue('coords').pipe(take(1))
        ),
        filter((coords): coords is TCoords => !!coords),
        switchMap((coords) =>
          this.positionService.updateCurrentPosition(coords)
        ),
        retry(),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.customSnackbarService.showSnackbar('success', {
          message: 'Erfolgreich abgemeldet',
        });
        this.router.navigate(['auth/login']);
      },
      error: () => {
        this.customSnackbarService.showSnackbar('warn', {
          message: 'Abmelden fehlgeschlagen, bitte versuche es erneut',
        });
      },
    });
  }

  showInviteFriendDialog() {
    this.matDialog.open(InviteFriendDialogComponent);
  }

  showPrivacyDialog() {
    this.matDialog.open(PrivacyComponent, {
      autoFocus: false,
      width: '95vw',
      maxWidth: '450px',
    });
  }

  showTwitterDialog() {
    this.matDialog.open(TwitterDialogComponent, {
      autoFocus: false,
      width: '95vw',
      maxWidth: '450px',
    });
  }

  showPointCollectionDialog() {
    this.matDialog.open(PointCollectionDialogComponent, {
      width: '95vw',
      maxWidth: '450px',
    });
  }
}
