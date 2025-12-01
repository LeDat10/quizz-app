import { NgClass } from '@angular/common';
import {
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ApplicationRef,
  inject,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription, fromEvent, merge } from 'rxjs';
import { filter, take, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-top-progress-bar',
  imports: [NgClass],
  templateUrl: './top-progress-bar.component.html',
  styleUrl: './top-progress-bar.component.scss',
})
export class TopProgressBarComponent implements OnInit, OnDestroy {
  progress = 0;
  isVisible = false;
  private routerSub!: Subscription;
  private intervalHandle: any;
  private appRef = inject(ApplicationRef);
  private timer: any;
  constructor(private readonly router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationStart) {
          this.StartProgress();
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.waitForPageLoad();
        }
      },
    });
  }

  private waitForPageLoad() {
    // Đợi Angular stable
    this.appRef.isStable
      .pipe(
        filter((stable) => stable),
        take(1)
      )
      .subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
          // Đợi tất cả images load
          const images = Array.from(document.images);
          const unloadedImages = images.filter((img) => !img.complete);

          if (unloadedImages.length === 0) {
            // Không có ảnh hoặc đã load hết
            requestAnimationFrame(() => this.FinishProgress());
          } else {
            // Đợi images load xong
            const imageLoads = unloadedImages.map((img) =>
              fromEvent(img, 'load').pipe(take(1))
            );

            merge(...imageLoads)
              .pipe(debounceTime(100)) // Đợi 100ms sau image cuối
              .subscribe(() => {
                requestAnimationFrame(() => this.FinishProgress());
              });

            // Timeout fallback - tối đa 3s
            setTimeout(() => {
              this.FinishProgress();
            }, 3000);
          }
        });
      });
  }

  StartProgress() {
    this.clearInterval();
    this.isVisible = true;
    this.progress = 0;

    this.ngZone.runOutsideAngular(() => {
      this.intervalHandle = setInterval(() => {
        if (this.progress < 90) {
          this.progress += Math.random() * 5;
        }
      }, 200);
    });
  }

  FinishProgress() {
    this.clearInterval();
    this.ngZone.run(() => {
      this.progress = 100;
    });

    this.timer = setTimeout(() => {
      this.ngZone.run(() => {
        this.isVisible = false;
        setTimeout(() => {
          this.ngZone.run(() => {
            this.progress = 0;
          });
        }, 250);
      });
    }, 300);
  }

  clearInterval() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
    this.routerSub.unsubscribe();
    clearTimeout(this.timer);
  }
}
