import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Observable, tap } from 'rxjs';
import { germanPaginatorIntl } from './common/german-paginator.intl';
import { credentialsInterceptor } from './common/interceptors/credentials.interceptor';
import { HealthService } from './common/services/health.service';
import { PseudoStoreService } from './common/services/pseudo-store.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { OfflineComponent } from './offline/offline.component';

registerLocaleData(localeDE);

function initializeAppFactory(
  healthService: HealthService,
  pseudoStoreService: PseudoStoreService
): () => Observable<any> {
  return () =>
    healthService.getHealth().pipe(
      tap((online) => {
        pseudoStoreService.updatePseudoStore({ online });
      })
    );
}

@NgModule({
  declarations: [AppComponent, NotFoundComponent, OfflineComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      // registrationStrategy: 'registerWhenStable:5000',

      registrationStrategy: 'registerImmediately',
    }),
  ],
  providers: [
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    { provide: MatPaginatorIntl, useValue: germanPaginatorIntl() },
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'de' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [HealthService, PseudoStoreService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
