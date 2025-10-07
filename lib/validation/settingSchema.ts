import { z } from "zod";

export const settingsSchema = z.object({
  timezone: z
    .string()
    .min(1, "Timezone is required")
    .default("Europe/Budapest"),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code (e.g., HUF, EUR, USD)")
    .toUpperCase()
    .default("HUF"),
});

export type SettingsInput = z.infer<typeof settingsSchema>;