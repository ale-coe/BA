import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IFacebookResponse } from './interfaces/facebook-response.interface';
import { FacebookAdapterService } from './services/facebook-adapter.service';

@Component({
  selector: 'app-facebook-adapter',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './facebook-adapter.component.html',
  styleUrl: './facebook-adapter.component.scss',
})
export class FacebookAdapterComponent implements OnInit {
  public fb = (window as any).FB;

  constructor(
    private readonly facebookAdapterService: FacebookAdapterService
  ) {}

  ngOnInit(): void {}

  connectWithFacebook() {
    this.fb.getLoginStatus((loginStatusResponse: IFacebookResponse) => {
      if (loginStatusResponse.authResponse) {
        this.checkToken(loginStatusResponse.authResponse.accessToken);
        return;
      }

      this.fb.login(
        (loginResponse: IFacebookResponse) => {
          this.checkToken(loginResponse.authResponse!.accessToken);
        },
        { scope: 'email' }
      );
    });
  }

  checkToken(token: string) {
    this.facebookAdapterService.checkToken({ token }).subscribe((_response) => {
      (_error: any) => {};
    });
  }

  logoutFromFacebook() {
    this.fb.getLoginStatus((_loginStatusResponse: IFacebookResponse) => {
      this.fb.logout(function (_logoutResponse: IFacebookResponse) {});
    });
  }
}
