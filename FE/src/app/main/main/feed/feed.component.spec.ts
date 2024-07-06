import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { FeedComponent } from './feed.component';
import { FeedService } from './services/feed.service';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedComponent],
      providers: [
        { provide: FeedService, useValue: { getFeed: () => of([[], 0]) } },
        {
          provide: PseudoStoreService,
          useValue: { updatePseudoStore: () => of() },
        },
        { provide: CustomSnackbarService, useValue: {} },
      ],

      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    component.matPaginator = { page: of() } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
