import { HttpErrorResponse } from '@angular/common/http';
import { delay, of, retry } from 'rxjs';

export const retryWithBackoff = (config: EffectConfig = {}) => {
  const {
    retry: shouldRetry = false,
    retryCount = 3,
    retryDelay = 1000,
  } = config;

  return (source: any) => {
    if (!shouldRetry) {
      return source;
    }

    return source.pipe(
      retry({
        count: retryCount,
        delay: (error: HttpErrorResponse, retryIndex: number) => {
          const delayMs = retryDelay * Math.pow(2, retryIndex);
          return of(null).pipe(delay(delayMs));
        },
      })
    );
  };
};
