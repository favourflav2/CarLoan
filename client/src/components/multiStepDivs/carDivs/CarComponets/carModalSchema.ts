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
    price: z
      .string({
        required_error: "Please enter a price",
      })
      .refine((item) => parseInt(item) >= 1000, {
        message: "Please enter a price greater than or equal to $1,000",
      })
      .refine((item) => parseInt(item) <= 750000, {
        message: "Please enter a price less than or equal to $750,000",
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
    salary: z
      .string({
        required_error: "Please enter your salary",
      })
      .refine((item) => parseInt(item) <= 1000000, {
        message: "Please enter an income/salary less than 1,000,000",
      }),
      term: z.number({
        required_error: "Please select a time",
      }).refine((item) => item <= 120 , {
        message: "Please enter a number less than or equal 120 months",
      })
      .refine((item) => item >= 36 , {
        message: "Please enter a number greater than or equal 36 months",
      }),
    id: z.string(),
    extraPayment: z.string(),
    img: z.any().optional(),
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
  });
