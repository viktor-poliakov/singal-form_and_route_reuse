import { Injectable } from '@angular/core';
import { ILoginFormModel } from '../components/signal-form/signal-form';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public login(loginFormModel: ILoginFormModel) {
    return of(true).pipe(delay(4000))
  }
}
