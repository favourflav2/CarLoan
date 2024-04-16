import { z } from "zod";

export const house1stSchema = z
  .object({
    streetAddress: z
      .string({
        required_error: "Please enter a name",
      })
      .max(50, {
        message: "Max length is 50",
      })
      .min(4, {
        message: "Min length is 4",
      }),
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
    term: z.number({
      required_error: "Please select a time",
    }),
    id: z.string(),
    extraPayment: z.string(),
    img: z.any().optional(),
    propertyTax: z.string({
        required_error: "Please enter your property tax rate",
    }),
    insurance: z.string({
        required_error: "Please enter home owners insurance",
    }),
    mortgageInsurance: z.string(),
  })
  .superRefine((values, ctx) => {
    if (parseInt(values.downPayment) >= parseInt(values.price)) {
      ctx.addIssue({
        message: "Your down payment should not be greater the house price.",
        code: z.ZodIssueCode.custom,
        path: ["downPayment"],
      });
      ctx.addIssue({
        message: "Your down payment should not be greater the house price.",
        code: z.ZodIssueCode.custom,
        path: ["price"],
      });
    }
  });