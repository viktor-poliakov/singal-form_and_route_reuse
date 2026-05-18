import {Component, signal, WritableSignal} from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';

import {JsonPipe} from '@angular/common';
import {registerFormSchema} from './schema';

export interface IRegisterFormModel {
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  gender: string;
  state: string;
}

@Component({
  selector: 'app-signal-form',
  standalone: true,
  imports: [FormField, JsonPipe],
  templateUrl: './signal-form-validator.html',
  styleUrl: './signal-form-validator.scss'
})
export class SignalFormValidator {
  protected formModel: WritableSignal<IRegisterFormModel> = signal({
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    gender: '',
    state: ''
  })

  protected registrationForm: FieldTree<IRegisterFormModel> = form(this.formModel, registerFormSchema)

}
