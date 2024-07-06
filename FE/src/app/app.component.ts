import { Component, OnInit } from '@angular/core';
import { PseudoStoreService } from './common/services/pseudo-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.pseudoStoreService.getSingleValue('online').subscribe((isOnline) => {
      if (isOnline) {
        return;
      }

      this.router.navigate(['/offline']);
    });
  }
}
