import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ImagesService } from '../../services/images.service';
import { TImageSrc } from './interfaces/profile-image-src.type';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent implements OnChanges {
  public isLoading = false;
  @Input({ required: true }) src!: TImageSrc;
  @Input() spinnerDiameter = 40;
  @Output() imageLoaded = new EventEmitter<void>();

  public data = 'data:image/png;base64,';

  constructor(private readonly imageService: ImagesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('src' in changes) {
      const currentValue = changes['src'].currentValue;

      if (Array.isArray(currentValue)) {
        const [loadingImage, fallback, scope, imageName] = currentValue;
        this.data = loadingImage;
        this.isLoading = true;

        this.imageService
          .getImage(scope, imageName)
          .pipe(
            finalize(() => {
              this.isLoading = false;
              this.imageLoaded.emit();
            })
          )
          .subscribe({
            next: (image) => {
              this.data = image.startsWith('assets')
                ? image
                : `data:image/png;base64,${image}`;
            },
            error: () => {
              this.data = fallback;
            },
          });
      } else {
        this.data = currentValue;
        this.imageLoaded.emit();
      }
    }
  }
}
