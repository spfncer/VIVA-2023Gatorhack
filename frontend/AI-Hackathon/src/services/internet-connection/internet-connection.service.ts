import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var window: any;

/**
 * A service which monitors internet connection status
 */
@Injectable({
  providedIn: 'root'
})
export class InternetConnectionService {
  private isOnline$ = new BehaviorSubject<boolean>(window.navigator.onLine);

  constructor() { 
    window.addEventListener('online', () => this.isOnline$.next(true));
    window.addEventListener('offline', () => this.isOnline$.next(false));
  }

  public getConnectionStatus(): boolean  {
    return this.isOnline$.value;
  }

  public observeConnectionStatus(): Observable<boolean>  {
    return this.isOnline$.asObservable();
  }
}