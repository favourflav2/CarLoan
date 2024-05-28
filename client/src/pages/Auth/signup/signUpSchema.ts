import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string({
        required_error: "Please enter a name",
      })
      .max(50, {
        message: "Max length is 50",
      })
      .min(4, {
        message: "Min length is 4",
      }),
    email: z
      .string({
        required_error: "Please enter an email",
      })
      .email()
      .max(30),
    password: z
      .string({
        required_error: "Please enter a password",
      })
      .min(8)
      .max(20),
    confirmPassword: z
      .string({
        required_error: "Please confirm your password",
      })
  })
  .superRefine((values, ctx) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);  // eslint-disable-line

    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < values.password.length; i++) {
      let ch = values.password.charAt(i);

      // checking if we have a number
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    if (
        countOfLowerCase < 1 ||
        countOfUpperCase < 1 ||
        countOfSpecialChar < 1 ||
        countOfNumbers < 1
      ) {
        ctx.addIssue({
          code: "custom",
          message: "password does not meet complexity requirements",
          path: ["password"],
        });
      }
  })
  .superRefine((values, ctx) => {
    if(values.confirmPassword !== values.password){
        ctx.addIssue({
            code: "custom",
            message: "Passwords don't match",
            path: ["confirmPassword"],
          });
    }
  })
