import { Injectable} from '@angular/core';
import {catchError, delay, of} from 'rxjs';
import {TForm} from '../components/form-async/form-async';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public userNameIsAvailable(userName: string) {
    if (userName.toLowerCase() === "poliakov") {
      return of(false)
        .pipe(
          delay(300),
          catchError(() => of(false))
        )
    }
    return of(true).pipe(delay(300))
  }

  public register(payload: TForm) {
    return of({}).pipe(delay(300))
  }
}
