import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InviteFriendService } from './invite-friend.service';

describe('InviteFriendService', () => {
  let service: InviteFriendService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(InviteFriendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
