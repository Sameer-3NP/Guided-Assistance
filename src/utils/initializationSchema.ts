import { z } from "zod";

export const initializationSchema = z.object({
  applicationDate: z.string().min(1, "Application Date is required"),
  closingDate: z.string().min(1, "Estimated Closing Date is required"),
  creditAsOfDate: z.string().min(1, "Credit Report Date is required"),
  borrowerCount: z.coerce.number().min(1, "Borrower Count is required"),
});
// .refine(
//   (data) => new Date(data.closingDate) > new Date(data.applicationDate),
//   {
//     message: "Closing Date can't be same as  Application Date",
//     path: ["closingDate"],
//   },
// )
// .refine(
//   (data) => new Date(data.creditAsOfDate) < new Date(data.applicationDate),
//   {
//     message: "Credit Date must be before Application Date",
//     path: ["creditAsOfDate"],
//   },
// );

export type InitializationForm = z.infer<typeof initializationSchema>;
