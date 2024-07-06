import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ImagesService } from 'src/app/common/services/images.service';
import { TrashImageService } from './services/trash-image.service';
import { TrashImagesComponent } from './trash-images.component';

describe('TrashImagesComponent', () => {
  let component: TrashImagesComponent;
  let fixture: ComponentFixture<TrashImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrashImagesComponent],
      providers: [
        { provide: ImagesService, useValue: { getImages: () => of([[], 0]) } },
        { provide: TrashImageService, useValue: {} },
        { provide: CustomSnackbarService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TrashImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
