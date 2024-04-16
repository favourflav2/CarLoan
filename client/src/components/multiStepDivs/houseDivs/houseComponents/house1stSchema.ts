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
    mortgageInsurance: z.string().refine((item)=> parseInt(item) < 10,{
      message: "Please enter a number between 0% and 10%",
    }),
    appreciation: z.string({
      required_error: "The average home appreciation per year in the United States is between 2-4%, you can choose what you need",
  }),
  opportunityCostRate: z.string({
    required_error: "Please enter a rate",
  }),
  maintenance:z.string({
    required_error: "A common suggestion is to allocate approximately 1% of the property's value per year, on average, to cover maintenance costs.",
  })
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
  })
  .superRefine((values, ctx) => {
    const twentyPercentValue = Number(parseInt(values.price) * .20)
    if(parseInt(values.mortgageInsurance) === 0){
      if (parseInt(values.downPayment) < twentyPercentValue) {
        ctx.addIssue({
          message: "Since your down payment is less than 20%, you will need to pay mortgage insurance",
          code: z.ZodIssueCode.custom,
          path: ["mortgageInsurance"],
        });
      }
    }
  });
 