import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, finalize, map, scan, timer } from 'rxjs';
import { CustomSnackbarService } from 'src/app/common/components/custom-snackbar/custom-snackbar.service';
import { ImagesService } from 'src/app/common/services/images.service';
import { PseudoStoreService } from 'src/app/common/services/pseudo-store.service';
import { PointsService } from '../menu/product/services/points.service';
import { LandmarkService } from './services/landmark.service';
import { ILandmark } from './interfaces/landmark.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('filePicker') filePicker!: ElementRef<HTMLInputElement>;
  @HostListener('window:click')
  onClick() {
    this.showImageSourceButtons = false;
  }

  public now = Date.now();
  public isLoading = false;
  // TODO_1: if error show error message
  public points: number | null = null;
  public events: ILandmark[] = [];
  // TODO_1: if error show error message
  public eventDisplayer$: Observable<ILandmark> | null = null;

  public showImageSourceButtons = false;
  constructor(
    private readonly pseudoStoreService: PseudoStoreService,
    private readonly imageService: ImagesService,
    private readonly customSnackbarService: CustomSnackbarService,
    private readonly pointsService: PointsService,
    private readonly landmarkService: LandmarkService
  ) {}

  ngOnInit(): void {
    this.pseudoStoreService.updatePseudoStore({
      title: '',
      activeMainscreen: 'home',
    });
    this.pointsService.getCurrentMonthsPoints().subscribe({
      next: (points) => (this.points = points),
      error: () =>
        this.customSnackbarService.showSnackbar('warn', { message: '' }),
    });
    this.landmarkService
      .getLandmarks({ includeInactive: 0, isEvent: 1, skip: 0, take: 5 })
      .subscribe({
        next: ([events]) => {
          this.events = events;
          this.eventDisplayer$ = timer(0, 10_000).pipe(
            scan((acc) => acc + 1, 0),
            map((i) => this.events[i % this.events.length])
          );
        },
        error: () =>
          this.customSnackbarService.showSnackbar('warn', {
            message: 'Fehler beim Laden der Events',
          }),
      });
  }

  ngOnDestroy(): void {
    this.pseudoStoreService.updatePseudoStore({ activeMainscreen: false });
  }

  onFileChange(fileList: FileList | null) {
    const file = fileList?.item(0);
    if (!file) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.imageService
      .uploadImage('trashImage', file)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.filePicker.nativeElement.value = '';
          this.customSnackbarService.showSnackbar('success', {
            message:
              'Danke für die Beseitigung des Mülls, in Kürze werden dir Punkte gutgeschrieben, weiter so!',
          });
        },
        error: () => {
          this.customSnackbarService.showSnackbar('warn', {
            message:
              'Fehler beim Hochladen des Bilds, bitte versuche es erneut',
          });
        },
      });
  }
}
