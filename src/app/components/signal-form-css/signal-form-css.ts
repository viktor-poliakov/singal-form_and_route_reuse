import {Component, signal, WritableSignal} from '@angular/core';
import {
  FieldTree,
  form,
  FormField,
  required,
  schema,
  Schema,
} from '@angular/forms/signals';
import {JsonPipe} from '@angular/common';

export type TFormModel = {
  userName: string;
  age: string;
  contactDetails: {
    street: string;
    number: string;
    postalCode: string
  }
}

export const registerFormSchema: Schema<TFormModel> = schema((form) => {
  required(form.userName, { message: "Field userName is required"});
  required(form.age, { message: "Field age is required" });
  required(form.contactDetails.street, { message: "Field street is required" });
})

@Component({
  selector: 'app-signal-form-css',
  standalone: true,
  imports: [
    FormField,
    JsonPipe
  ],
  templateUrl: './signal-form-css.html',
  styleUrl: './signal-form-css.scss'
})
export class SignalFormCss {
  protected formModel: WritableSignal<TFormModel> = signal({
    userName: '',
    age: '',
    contactDetails: {
      street: '',
      number: '',
      postalCode: ''
    }
  })

  protected registerForm: FieldTree<TFormModel> = form(this.formModel, registerFormSchema)
}
