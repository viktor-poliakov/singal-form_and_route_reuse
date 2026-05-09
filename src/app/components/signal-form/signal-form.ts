import {Component, signal, WritableSignal} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ILoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signal-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signal-form.html',
  styleUrl: './signal-form.scss'
})
export class SignalForm {

  protected loginModel: WritableSignal<ILoginFormModel> = signal({
    email: "",
    password: ""
  })

  // loginForm = form

  onLogin(event: Event) {
    event.preventDefault();

    console.log(this.loginModel());
  }
}
