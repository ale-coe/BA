import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { InviteFriendDialogComponent } from './invite-friend-dialog.component';
import { InviteFriendService } from './services/invite-friend.service';

describe('InviteFriendDialogComponent', () => {
  let component: InviteFriendDialogComponent;
  let fixture: ComponentFixture<InviteFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InviteFriendDialogComponent],
      providers: [
        { provide: InviteFriendService, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
