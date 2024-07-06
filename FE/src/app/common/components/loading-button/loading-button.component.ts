import { NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-button',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule, NgIf, NgStyle],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.scss',
})
export class LoadingButtonComponent {
  @Input() disabled = false;
  @Input() showSpinner = false;
  @Input() ngStyle = {};
  @Input() color = 'primary';
  @Input() type = 'button';

  @Output() _click = new EventEmitter<void>();
}
