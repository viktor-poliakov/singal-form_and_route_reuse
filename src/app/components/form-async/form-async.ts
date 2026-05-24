import {Component, inject, Signal, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField, required, validateAsync, validateHttp} from '@angular/forms/signals';
import {JsonPipe} from '@angular/common';
import {AuthService} from '../../services/auth-service';
import {rxResource} from '@angular/core/rxjs-interop';
import {debounce, debounceTime} from 'rxjs';

export type TForm = {
  department: string;
  userName: string;
  age: number
}

@Component({
  selector: 'app-form-async',
  standalone: true,
  imports: [
    FormField,
    JsonPipe
  ],
  templateUrl: './form-async.html',
  styleUrl: './form-async.scss'
})
export class FormAsync {
  private authService: AuthService = inject(AuthService);
  private userFormValues: WritableSignal<TForm> = signal({
    department: '',
    userName: '',
    age: 0
  });

  private createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return rxResource({
      params: () => usernameSignal(),
      stream: ({ params: userName }) => this.authService.userNameIsAvailable(userName),
    });
  };

  protected userForm: FieldTree<TForm> = form(this.userFormValues, (form) => {
    required(form.age)
    required(form.userName)
    validateAsync(form.userName, {
      params: ({ value }) => value(),
      factory: this.createUsernameResource,
      onSuccess: (result) => {
        return  result ? null : { kind: 'usernameTaken', message: 'Username taken' }
      },
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  })
}
