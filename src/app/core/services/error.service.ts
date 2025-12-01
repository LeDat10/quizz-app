import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ERROR_MESSAGES, ERROR_TITLES } from '../../constants/error-message';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private notification = inject(NzNotificationService);

  handleError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    const url = request.url;

    if (url.includes('/categories')) {
      this.handleCategoryError(error);
    }
  }

  handleLoginError(error: HttpErrorResponse): void {
    const errorCode = error.error?.errorCode;
    const message = error.error?.message;
  }

  handleCategoryError(error: HttpErrorResponse): void {
    const errorTitle = ERROR_TITLES[error.status];
    switch (error.status) {
      case 404:
        this.notification.error(
          errorTitle,
          ERROR_MESSAGES['CATEGORY_NOT_FOUND']
        );
        break;
      case 409:
        this.notification.error(
          errorTitle,
          ERROR_MESSAGES['CATEGORY_HAS_COURSES']
        );
        break;
      case 500:
        this.notification.error(
          errorTitle,
          ERROR_MESSAGES['INTERNAL_SERVER_ERROR']
        );
        break;
      case 502:
        this.notification.error(
          errorTitle,
          ERROR_MESSAGES['INTERNAL_SERVER_ERROR']
        );
        break;
      case 503:
        this.notification.error(
          errorTitle,
          ERROR_MESSAGES['SERVICE_UNAVAILABLE']
        );
        break;
      case 0:
        this.notification.error(errorTitle, ERROR_MESSAGES['NETWORK_ERROR']);
        break;
      default:
        this.notification.error(
          errorTitle || 'Error',
          ERROR_MESSAGES['INTERNAL_SERVER_ERROR']
        );
        break;
    }
  }
}
