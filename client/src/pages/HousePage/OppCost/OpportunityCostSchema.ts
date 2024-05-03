import { z } from "zod";

export const opportunityCostSchema = z
  .object({
    opportunityCostRate: z
      .string({
        required_error: "Please enter a rate",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    maintenance: z
      .string({
        required_error: "A common suggestion is to allocate approximately 1% of the property's value per year, on average, to cover maintenance costs.",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    rent: z
      .string({
        required_error: "A common suggestion is to allocate approximately 1% of the property's value per year, on average, to cover maintenance costs.",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    appreciation: z
      .string({
        required_error: "The average home appreciation per year in the United States is between 2-4%, you can choose what you need",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    propertyTax: z
      .string({
        required_error: "Please enter your property tax rate",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
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
  })
  .superRefine((values, ctx) => {
    if (parseFloat(values.appreciation) >= parseFloat(values.opportunityCostRate)) {
      ctx.addIssue({
        message:
          "For this calculator to be used to its fullest potential we need to make sure that the expected return is greater than the appreciation. Please make sure that your expected return value is greater than the appreciation.",
        code: z.ZodIssueCode.custom,
        path: ["appreciation"],
      });
      ctx.addIssue({
        message:
          "For this calculator to be used to its fullest potential we need to make sure that the expected return is greater than the appreciation. Please make sure that your expected return value is greater than the appreciation.",
        code: z.ZodIssueCode.custom,
        path: ["opportunityCostRate"],
      });
    }
  });
