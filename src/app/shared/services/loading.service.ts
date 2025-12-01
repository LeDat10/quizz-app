import { BehaviorSubject } from 'rxjs';

export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  start() {
    this._loading.next(true);
  }

  finish() {
    this._loading.next(false);
  }
}
