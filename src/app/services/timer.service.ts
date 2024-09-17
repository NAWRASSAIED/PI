import { Injectable } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private destroy$: Subject<void> = new Subject<void>();

  constructor() { }

  startTimer(duration: number): Observable<number> {
    return timer(duration).pipe(
      takeUntil(this.destroy$)
    );
  }

  stopTimer() {
    this.destroy$.next();
  }
}
