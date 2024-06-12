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
    }).refine((item) => item.length > 0, {
      message: "Please enter a price",
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
    extraPayment: z.string().refine((item) => item.length > 0, {
      message: "Please enter a value",
    }),
    img: z.any(),
    propertyTax: z.string({
      required_error: "Please enter your property tax rate",
    }).refine((item) => item.length > 0, {
      message: "Please enter a value",
    }),
    insurance: z.string({
      required_error: "Please enter home owners insurance",
    }).refine((item) => item.length > 0, {
      message: "Please enter a value",
    }),
    mortgageInsurance: z
      .string({
        required_error: "Please enter a mortgage insurance rate",
      })
      .refine((item) => parseFloat(item) < 10, {
        message: "Please enter a number between 1% and 10%",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a value",
      }),
    appreciation: z.string({
      required_error: "The average home appreciation per year in the United States is between 2-4%, you can choose what you need",
    }).refine((item) => item.length > 0, {
      message: "Please enter a value",
    }),
    opportunityCostRate: z.string({
      required_error: "Please enter a rate",
    }).refine((item) => item.length > 0, {
      message: "Please enter a value",
    }),
    maintenance: z.string({
      required_error: "A common suggestion is to allocate approximately 1% of the property's value per year, on average, to cover maintenance costs.",
    }).refine((item) => item.length > 0, {
      message: "Please enter a value",
    }),
    rent: z
      .string({
        required_error: "Please enter a rent you would like to compare with",
      }).refine((item) => item.length > 0, {
        message: "Please enter a value",
      }),
  })
  .superRefine((values, ctx) => {
    if (parseFloat(values.downPayment) >= parseFloat(values.price)) {
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
    const thirtyPercentOfPrice = parseFloat(values.price) * 0.3;
    if (parseFloat(values.extraPayment) > thirtyPercentOfPrice) {
      ctx.addIssue({
        message: "Your extra payment can't exceed 30% of the house price",
        code: z.ZodIssueCode.custom,
        path: ["extraPayment"],
      });
    }
  });
// .superRefine((values, ctx) => {
//   const twentyPercentValue = Number(parseFloat(values.price) * 0.2);
//   if (parseFloat(values.downPayment) < twentyPercentValue) {
//     ctx.addIssue({
//       message: "Since your down payment is less than 20%, you will need to pay mortgage insurance",
//       code: z.ZodIssueCode.custom,
//       path: ["mortgageInsurance"],
//     });
//   }
// });
