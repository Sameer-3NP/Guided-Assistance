import { z } from "zod";

export const initializationSchema = z.object({
  applicationDate: z.string().min(1, "Application Date is required"),
  closingDate: z.string().min(1, "Estimated Closing Date is required"),
  creditAsOfDate: z.string().min(1, "Credit Report Date is required"),
  borrowerCount: z.coerce.number().min(1, "Borrower Count is required"),
  loanNumber: z.string().regex(/^\d{4}$/, "Enter last 4 digits of loan number"),
});

export type InitializationForm = z.infer<typeof initializationSchema>;
