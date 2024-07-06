import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map } from 'rxjs';
import { IPseudoStore } from './pseudo-store.interface';

@Injectable({
  providedIn: 'root',
})
export class PseudoStoreService {
  private pseudoStore = new BehaviorSubject<IPseudoStore>({
    title: '',
    positionShared: false,
    coords: undefined,
    userRole: undefined,
    userId: undefined,
    online: false,
    activeMainscreen: false,
  });

  public updatePseudoStore(newData: Partial<IPseudoStore>) {
    this.pseudoStore.next({ ...this.pseudoStore.value, ...newData });
  }

  public getSingleValue<K extends keyof IPseudoStore>(
    key: K
  ): Observable<IPseudoStore[K]> {
    return this.pseudoStore.pipe(
      delay(0),
      map((data) => data[key])
    );
  }

  public getStoreValue() {
    return this.pseudoStore.pipe(delay(0));
  }
}
