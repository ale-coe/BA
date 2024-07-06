import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { activateUserGuard } from '../common/guards/activate-user.guard';
import { loggedInGuard } from '../common/guards/logged-in.guard';
import { ActivateUserComponent } from './main/activate-user/activate-user.component';
import { FeedComponent } from './main/feed/feed.component';
import { HomeComponent } from './main/home/home.component';
import { LadderComponent } from './main/ladder/ladder.component';
import { MainComponent } from './main/main.component';
import { FeedbackComponent } from './main/menu/feedback/feedback.component';
import { ProfileComponent } from './main/menu/profile/profile.component';
import { AdminComponent } from './main/admin/admin.component';
import { adminGuard } from '../common/guards/admin.guard';
import { ProductsComponent } from './main/menu/product/products.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [loggedInGuard],
      },
      { path: 'feed', component: FeedComponent, canActivate: [loggedInGuard] },
      {
        path: 'feedback',
        component: FeedbackComponent,
        canActivate: [loggedInGuard],
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [loggedInGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [loggedInGuard],
      },
      {
        path: 'ladder',
        component: LadderComponent,
        canActivate: [loggedInGuard],
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [loggedInGuard, adminGuard],
      },
      {
        path: 'activate-user',
        component: ActivateUserComponent,
        canActivate: [activateUserGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainRoutingModule {}
