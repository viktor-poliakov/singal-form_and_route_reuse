import { Routes } from '@angular/router';
import { SignalForm } from './components/signal-form/signal-form';
import {SignalFormValidator} from './components/signal-form-validator/signal-form-validator';
import {SignalFormCss} from './components/signal-form-css/signal-form-css';
import {FormAsync} from './components/form-async/form-async';

export const routes: Routes = [
  {
    path: '',
    component: SignalForm,
    pathMatch: 'full',
  },
  {
    path: 'validator',
    component: SignalFormValidator,
    // Флаг читает наша CachedRouteReuseStrategy: при уходе с /validator
    // компонент будет отсоединён от DOM и сохранён в кэше, а при возврате —
    // восстановлен без пересоздания (состояние формы, сигналы и подписки сохранятся).
    data: { reuse: true },
  },
  {
    path: 'css',
    component: SignalFormCss
  },
  {
    path: 'async',
    component: FormAsync
  }
];
