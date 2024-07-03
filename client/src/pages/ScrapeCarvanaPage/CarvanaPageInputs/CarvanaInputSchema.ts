import { z } from "zod";


export const carvanaSchema = z
  .object({
    sortByState: z.enum(["All" , "Highest Price" , "Lowest Price" , "Lowest Mileage"]),
    lowPrice: z
      .string({
        required_error: "Please enter a price",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    highPrice: z
      .string({
        required_error: "Please enter a price",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    lowMileage: z
      .string({
        required_error: "Please enter a price",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    highMileage: z
      .string({
        required_error: "Please enter a price",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    // searchState: z.string({
    //   required_error: "Please enter a price",
    // }),
    Acura: z.boolean(),
    AlfaRomeo: z.boolean(),
    Audi: z.boolean(),
    BMW: z.boolean(),
    Buick: z.boolean(),
    Cadillac: z.boolean(),
    Chevrolet: z.boolean(),
    Chrysler: z.boolean(),
    Dodge: z.boolean(),
    FIAT: z.boolean(),
    Ford: z.boolean(),
    Genesis: z.boolean(),
    GMC: z.boolean(),
    Honda: z.boolean(),
    Hyundai: z.boolean(),
    INFINITI: z.boolean(),
    Jaguar: z.boolean(),
    Jeep: z.boolean(),
    Kia: z.boolean(),
    LandRover: z.boolean(),
    Lexus: z.boolean(),
    Lincoln: z.boolean(),
    Lucid: z.boolean(),
    Maserati: z.boolean(),
    Mazada: z.boolean(),
    MercedesBenz: z.boolean(),
    MINI: z.boolean(),
    Mitsubishi: z.boolean(),
    Nissan: z.boolean(),
    Polestar: z.boolean(),
    Porsche: z.boolean(),
    Ram: z.boolean(),
    Rivian: z.boolean(),
    Scion: z.boolean(),
    Subaru: z.boolean(),
    Tesla: z.boolean(),
    Toyota: z.boolean(),
    Volkswagen: z.boolean(),
    Volvo: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (parseFloat(values.lowPrice) >= parseFloat(values.highPrice)) {
      ctx.addIssue({
        message: "Please make sure your lowest price is not greater than or equal to the highest price.",
        code: z.ZodIssueCode.custom,
        path: ["lowPrice"],
      });
      ctx.addIssue({
        message: "Please make sure your lowest price is not greater than or equal to the highest price.",
        code: z.ZodIssueCode.custom,
        path: ["highPrice"],
      });
    }
  })
  .superRefine((values, ctx) => {
    if (parseFloat(values.lowMileage) >= parseFloat(values.highMileage)) {
      ctx.addIssue({
        message: "Please make sure your lowest mileage is not greater than or equal to the highest mileage.",
        code: z.ZodIssueCode.custom,
        path: ["highMileage"],
      });
      ctx.addIssue({
        message: "Please make sure your lowest mileage is not greater than or equal to the highest mileage.",
        code: z.ZodIssueCode.custom,
        path: ["lowMileage"],
      });
    }
  });

 
