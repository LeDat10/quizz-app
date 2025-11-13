import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { routes } from './app.routes';
import {
  matCategory,
  matCheck,
  matDashboard,
  matDeleteOutline,
  matEdit,
  matKeyboardArrowDown,
  matMenu,
  matMenuBook,
  matPlus,
  matSearch,
  matWarning,
} from '@ng-icons/material-icons/baseline';

import {
  matFileUploadOutline,
  matNotificationsNoneOutline,
} from '@ng-icons/material-icons/outline';
import { provideStore } from '@ngrx/store';
import { provideRouterStore } from '@ngrx/router-store';
import { provideEffects } from '@ngrx/effects';
import { appReducer } from './store/app.state';
import { CustomSerializer } from './store/router/custom-serializer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIcons({
      matDashboard,
      matMenuBook,
      matCategory,
      matSearch,
      matMenu,
      matNotificationsNoneOutline,
      matKeyboardArrowDown,
      matCheck,
      matDeleteOutline,
      matFileUploadOutline,
      matPlus,
      matEdit,
      matWarning,
    }),
    provideStore(appReducer, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictActionTypeUniqueness: true,
        strictActionWithinNgZone: true,
      },
    }),
    provideRouterStore({
      serializer: CustomSerializer,
    }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
