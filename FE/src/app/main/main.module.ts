import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ImageComponent } from '../common/components/image/image.component';
import { LoadingButtonComponent } from '../common/components/loading-button/loading-button.component';
import { OverlayComponent } from '../common/components/overlay/overlay.component';
import { FormErrorPipe } from '../common/pipes/form-error.pipe';
import { MainRoutingModule } from './main.routing.module';
import { ActivateUserComponent } from './main/activate-user/activate-user.component';
import { AdminComponent } from './main/admin/admin.component';
import { FeedbackAdminComponent } from './main/admin/feedback-admin/feedback-admin.component';
import { AddLandmarkDialogComponent } from './main/admin/landmark/add-landmark-dialog/add-landmark-dialog.component';
import { LandmarkComponent } from './main/admin/landmark/landmark.component';
import { AddProductDialogComponent } from './main/admin/products-admin/add-product-dialog/add-product-dialog.component';
import { ProductsAdminComponent } from './main/admin/products-admin/products-admin.component';
import { ProfileAdminComponent } from './main/admin/profile-admin/profile-admin.component';
import { PushNotificationComponent } from './main/admin/push-notification/push-notification.component';
import { TrashImagesComponent } from './main/admin/trash-images/trash-images.component';
import { FeedComponent } from './main/feed/feed.component';
import { HomeComponent } from './main/home/home.component';
import { MapContainerDirective } from './main/home/map/map-container.directive';
import { TooltipContentComponent } from './main/home/map/tooltip-content/tooltip-content.component';
import { LadderComponent } from './main/ladder/ladder.component';
import { MainComponent } from './main/main.component';
import { FeedbackComponent } from './main/menu/feedback/feedback.component';
import { InviteFriendDialogComponent } from './main/menu/invite-friend-dialog/invite-friend-dialog.component';
import { ProductsComponent } from './main/menu/product/products.component';
import { ProfileComponent } from './main/menu/profile/profile.component';
import { UpdatePositionSharingDialogComponent } from './main/menu/profile/update-position-sharing-dialog/update-position-sharing-dialog.component';
import { FacebookAdapterComponent } from './main/menu/profile/facebook-adapter/facebook-adapter.component';
import { PointCollectionDialogComponent } from './main/menu/point-collection-dialog/point-collection-dialog.component';
import { PrivacyComponent } from './main/menu/privacy/privacy.component';
import { RaffleComponent } from './main/admin/raffle/raffle.component';
import { AddRaffleDialogComponent } from './main/admin/raffle/add-raffle-dialog/add-raffle-dialog.component';
import { TwitterDialogComponent } from './main/menu/twitter-dialog/twitter-dialog.component';
import { TranslationPipe } from '../common/pipes/translation.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    MainComponent,
    ActivateUserComponent,
    LadderComponent,
    FeedComponent,
    FeedbackComponent,
    ProfileComponent,
    UpdatePositionSharingDialogComponent,
    MapContainerDirective,
    TooltipContentComponent,
    AdminComponent,
    TrashImagesComponent,
    FeedbackAdminComponent,
    LandmarkComponent,
    AddLandmarkDialogComponent,
    ProfileAdminComponent,
    ProductsAdminComponent,
    AddProductDialogComponent,
    PushNotificationComponent,
    ProductsComponent,
    InviteFriendDialogComponent,
    PointCollectionDialogComponent,
    PrivacyComponent,
    RaffleComponent,
    AddRaffleDialogComponent,
    TwitterDialogComponent,
  ],
  imports: [
    OverlayComponent,
    LoadingButtonComponent,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MainRoutingModule,
    RouterModule,
    MatToolbarModule,
    MatToolbarModule,
    MatMenuModule,
    MatMenuModule,
    MatRadioModule,
    FormErrorPipe,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ImageComponent,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    FacebookAdapterComponent,
    TranslationPipe,
  ],
})
export class MainModule {}
