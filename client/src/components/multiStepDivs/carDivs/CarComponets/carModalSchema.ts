import { z } from "zod";

export const carsArr = [
    "Acura",
    "AlfaRomeo",
    "Audi",
    "BMW",
    "Buick",
    "Cadillac",
    "Chevrolet",
    "Chrysler",
    "Dodge",
    "FIAT",
    "Ford",
    "Genesis",
    "GMC",
    "Honda",
    "Hyundai",
    "INFINITI",
    "Jaguar",
    "Jeep",
    "Kia",
    "LandRover",
    "Lexus",
    "Lincoln",
    "Lucid",
    "Maserati",
    "Mazada",
    "MercedesBenz",
    "MINI",
    "Mitsubishi",
    "Nissan",
    "Polestar",
    "Porsche",
    "Ram",
    "Rivian",
    "Scion",
    "Subaru",
    "Telsa",
    "Toyota",
    "Volkswagen",
    "Volvo",
  ];


export const carModalSchema = z
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
    modal: z
      .string({
        required_error: "Please enter a modal",
      })
      .max(50, {
        message: "Max length is 50",
      })
      .min(1, {
        message: "Min length is 1",
      }),
    price: z.string({
      required_error: "Please enter a price",
    }),
    mileage: z.string({
      required_error: "Please enter a mileage",
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
    salary: z.string({
      required_error: "Please enter your salary",
    }),
    term: z.number({
      required_error: "Please select a time",
    }),
    id: z.string(),
    img: z.any().optional(),
    extraDownPayment: z.string({
      required_error: "Please enter a number between 0% and 39%",
    })
  })
  .superRefine((values, ctx) => {
    if (parseInt(values.downPayment) >= parseInt(values.price)) {
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
  })
  .superRefine((values, ctx) => {
    if (parseInt(values.extraDownPayment) >= parseInt(values.price)) {
      ctx.addIssue({
        message: "new error.",
        code: z.ZodIssueCode.custom,
        path: ["downPayment"],
      });
      ctx.addIssue({
        message: "new error.",
        code: z.ZodIssueCode.custom,
        path: ["price"],
      });
    }
  })