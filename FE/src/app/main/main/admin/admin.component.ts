import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, filter, takeUntil, timer } from 'rxjs';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { FeedbackAdminComponent } from './feedback-admin/feedback-admin.component';
import { TrashImagesComponent } from './trash-images/trash-images.component';
import { LandmarkComponent } from './landmark/landmark.component';
import { ProfileAdminComponent } from './profile-admin/profile-admin.component';

import { PushNotificationComponent } from './push-notification/push-notification.component';
import { ProductsAdminComponent } from './products-admin/products-admin.component';
import { RaffleComponent } from './raffle/raffle.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;
  private destroy$ = new Subject<void>();

  public options = [
    { label: 'Müllfotos', component: TrashImagesComponent, inputs: {} },
    { label: 'Feedback', component: FeedbackAdminComponent, inputs: {} },
    { label: 'Nutzerprofile', component: ProfileAdminComponent, inputs: {} },
    {
      label: 'Wichtige Orte',
      component: LandmarkComponent,
      inputs: { isEvent: 0 },
    },
    {
      label: 'Events',
      component: LandmarkComponent,
      inputs: { isEvent: 1 },
    },
    { label: 'Produkte', component: ProductsAdminComponent, inputs: {} },
    {
      label: 'Pusnotification erstellen',
      component: PushNotificationComponent,
      inputs: {},
    },
    {
      label: 'Verlosungen',
      component: RaffleComponent,
      inputs: {},
    },
  ];
  public formControl = new FormControl<number>(-1, { nonNullable: true });

  constructor(private readonly pseudoStoreService: PseudoStoreService) {}

  ngOnInit(): void {
    this.pseudoStoreService.updatePseudoStore({
      title: '',
      activeMainscreen: 'admin',
    });

    this.formControl.valueChanges
      .pipe(
        filter((index) => index >= 0),
        takeUntil(this.destroy$)
      )
      .subscribe((index) => {
        const { component } = this.options[index];
        this.viewContainer.clear();
        const ref = this.viewContainer.createComponent(component as any);
        Object.entries(this.options[index].inputs).forEach(([key, value]) => {
          (ref.instance as any)[key] = value;
        });
      });
  }

  ngOnDestroy(): void {
    this.pseudoStoreService.updatePseudoStore({ activeMainscreen: false });
    this.destroy$.next();
    this.destroy$.complete();
  }
}
