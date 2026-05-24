import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import {provideSignalFormsConfig} from '@angular/forms/signals';
import {NG_STATUS_CLASSES} from '@angular/forms/signals/compat';
import { CachedRouteReuseStrategy } from './route-reuse/cached-route-reuse.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideSignalFormsConfig({
      // classes: {
      //   'ng-invalid': state => state.errors().length > 0,
      // },
      classes: NG_STATUS_CLASSES
    }),
    // Подменяем дефолтную стратегию (BaseRouteReuseStrategy) на свою.
    // Угловой Router заберёт её через DI и будет спрашивать у неё,
    // что делать с компонентами при каждой навигации.
    { provide: RouteReuseStrategy, useClass: CachedRouteReuseStrategy },
  ]
};
