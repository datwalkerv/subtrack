import { z } from "zod";

export const subscriptionSchema = z.object({
  subscription: z.string().min(1, "Subscription name is required"),
  cost: z.coerce.number().positive("Cost must be greater than 0"),
  currency: z.string().length(3, "Currency must be a 3-letter code"),
  billingInterval: z.coerce.number().int().min(1),
  billingPeriod: z.enum(["Day", "Week", "Month", "Year"]),
  nextPaymentDate: z.coerce.date(),
  category: z.string().optional(),
  paymentMethod: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
