import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { TForm } from '../components/form-async/form-async';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public userNameIsAvailable(userName: string) {
    const isAvailable = userName.toLowerCase() !== 'poliakov';

    return of(isAvailable).pipe(
      delay(1000)
    );
  }

  public register(payload: TForm) {
    return of({}).pipe(delay(300))
  }
}
