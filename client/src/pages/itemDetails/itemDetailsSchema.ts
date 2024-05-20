import { z } from "zod";

export const itemDetailsSchema = z
  .object({
    price: z.string({
      required_error: "Please enter a price",
    }),
    downPayment: z
      .string({
        required_error: "Please enter a down payment",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a down payment",
      }),
    interest: z
      .string({
        required_error: "Please enter a number between 0% and 39%",
      })
      .refine((item) => Number(item.replace("%", "")) < 40, {
        message: "Please enter a number between 0% and 39%",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number between 0% and 39%",
      }),
    term: z
      .number({
        required_error: "Please select a time",
      })
      .refine((item) => item <= 120, {
        message: "Please enter a number less than or equal 120 months",
      })
      .refine((item) => item >= 36, {
        message: "Please enter a number greater than or equal 36 months",
      }),

    extraPayment: z.string().refine((item) => item.length > 0, {
      message: "Please enter a down payment",
    }),
  })
  .superRefine((values, ctx) => {
    if (parseFloat(values.downPayment) >= parseFloat(values.price)) {
      ctx.addIssue({
        message: "Your down payment should not be greater the car price.",
        code: z.ZodIssueCode.custom,
        path: ["downPayment"],
      });
      ctx.addIssue({
        message: "Your down payment should not be greater the car price.",
        code: z.ZodIssueCode.custom,
        path: ["price"],
      });
    }
  });
