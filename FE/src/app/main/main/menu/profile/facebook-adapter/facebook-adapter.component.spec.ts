import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacebookAdapterComponent } from './facebook-adapter.component';
import { FacebookAdapterService } from './services/facebook-adapter.service';

describe('FacebookAdapterComponent', () => {
  let component: FacebookAdapterComponent;
  let fixture: ComponentFixture<FacebookAdapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookAdapterComponent],
      providers: [{ provide: FacebookAdapterService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(FacebookAdapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
