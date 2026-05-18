import {Component, inject, signal, WritableSignal} from '@angular/core';
import {email, FieldTree, form, FormField, required, Schema, schema, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {LoginService} from '../../services/login.service';

export interface ILoginFormModel {
  email: string;
  password: string;
}

export const loginFormSchema: Schema<ILoginFormModel> = schema((currentForm) => {
  required(currentForm.email, {
    message: "Email is required",
  });
  email(currentForm.email, {
    message: "Please enter a valid email address",
  })
  required(currentForm.password);
})

@Component({
  selector: 'app-signal-form',
  standalone: true,
  imports: [FormField],
  templateUrl: './signal-form.html',
  styleUrl: './signal-form.scss'
})
export class SignalForm {
  private loginService: LoginService = inject(LoginService);

  protected loginModel: WritableSignal<ILoginFormModel> = signal({
    email: "",
    password: ""
  })

  protected loginForm: FieldTree<ILoginFormModel> = form(this.loginModel, loginFormSchema)

  async onLogin(event: Event) {
    event.preventDefault();

    const success = await submit(this.loginForm, async (form) => {
      const result = await firstValueFrom(this.loginService.login(form().value()))

      if (result) return null;

      return { kind: 'serverError', message: 'Failed to save' };
    });

    if (success) {
      // Handle success — navigate, show confirmation, etc.
      alert(111)
    }

    console.log(this.loginForm().value());
    console.log(this.loginForm().errors());
  }
}
