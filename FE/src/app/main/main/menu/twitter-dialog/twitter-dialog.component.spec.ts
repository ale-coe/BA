import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { TwitterService } from './services/twitter.service';
import { TwitterDialogComponent } from './twitter-dialog.component';

describe('TwitterDialogComponent', () => {
  let component: TwitterDialogComponent;
  let fixture: ComponentFixture<TwitterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwitterDialogComponent],
      providers: [
        {
          provide: TwitterService,
          useValue: { getAccountConnected: () => of('') },
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TwitterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
