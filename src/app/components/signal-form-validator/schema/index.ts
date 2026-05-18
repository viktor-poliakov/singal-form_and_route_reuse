import {
  ChildFieldContext,
  email, hidden,
  required,
  Schema,
  schema,
  validate,
  validateTree
} from '@angular/forms/signals';
import {IRegisterFormModel} from '../signal-form-validator';

export const registerFormSchema: Schema<IRegisterFormModel> = schema((form) => {
  email(form.email, { message: 'Enter a valid email'});
  required(form.email);
  validate(form.confirmPassword, (ctx: ChildFieldContext<string>) => {
    const password = ctx.valueOf(form.password);
    const confirmPassword = ctx.value();

    if (password !== confirmPassword) {
      return {
        message: "Password do not match",
        kind: 'passwordMismatch'
      }
    }

    return null
  });
  validateTree(form, (ctx) => {
    if (ctx.valueOf(form.password) !== ctx.valueOf(form.confirmPassword)) {
      return [
        {
          kind: 'passwordMismatch2',
          message: "Password do not match2",
          fieldTree: ctx.fieldTree.confirmPassword as any
        },
        {
          kind: 'passwordMismatch2',
          message: "Password do not match2",
          fieldTree: ctx.fieldTree.password as any
        }
      ]
    }

    return null
  })
  required(form.country)
  required(form.state, {
    message: 'State is not be empty',
    when: (ctx) => {
      const country = ctx.valueOf(form.country)
      return country === 'US'
    },
  })
  hidden(form.state, (ctx) => {
    return ctx.valueOf(form.country) !== 'US'
  })
})
