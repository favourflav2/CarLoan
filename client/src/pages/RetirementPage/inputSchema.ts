import { z } from "zod";

export const schema = z.object({
    age: z
      .object({
        currentAge: z
          .number({
            required_error: "Please enter a number between 18 and 80",
            invalid_type_error: "Please enter a number between 18 and 80",
          })
          .min(18, { message: "Please enter a number between 18 and 80" })
          .max(80, { message: "Please enter a number between 18 and 80" }),
  
        retireAge: z
          .number({
            required_error: "Please enter a number",
            invalid_type_error: "Please enter a number",
          })
          .max(90, { message: "90 is the max age" }),
  
        lifeExpectancy: z
          .number({
            required_error: "Please enter a number",
            invalid_type_error: "Please enter a number",
          })
          .max(120, { message: "120 is the max age" }),
      })
      .refine(({ currentAge, retireAge }) => currentAge <= retireAge - 1, {
        message: "Your retirement age must be higher than your current age",
        path: ["retireAge"],
      })
      .refine(({ currentAge, retireAge }) => currentAge <= retireAge - 1, {
        message: "Your retirement age must be higher than your current age",
        path: ["currentAge"],
      })
      .refine(({ retireAge, lifeExpectancy }) => retireAge <= lifeExpectancy - 1, {
        message: "Your retirement age must be higher than your current age",
        path: ["lifeExpectancy"],
      }),
    savings: z
      .string({
        required_error: "Please enter a number",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    monthlyContribution: z
      .string({
        required_error: "Please enter a number",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    budget: z
      .string({
        required_error: "Please enter a number",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number",
      }),
    preRate: z
      .string({
        required_error: "Please enter a number between 0% and 15%",
      })
      .refine((item) => Number(item.replace("%", "")) < 16, {
        message: "Please enter a number between 0% and 15%",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number between 0% and 15%",
      }),
    postRate: z
      .string({
        required_error: "Please enter a number between 0% and 15%",
      })
      .refine((item) => Number(item.replace("%", "")) < 16, {
        message: "Please enter a number between 0% and 15%",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number between 0% and 15%",
      }),
    inflation: z
      .string({
        required_error: "Please enter a number between 0% and 15%",
      })
      .refine((item) => Number(item.replace("%", "")) < 16, {
        message: "Please enter a number between 0% and 15%",
      })
      .refine((item) => item.length > 0, {
        message: "Please enter a number between 0% and 15%",
      }),
    id: z.string().optional(),
  });