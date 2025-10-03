import { z } from "zod";

export const teamSchema = z.object({
  teamName: z.string().trim().min(1, "Name must be at least 2 characters long"),
  teamSlug: z.string().regex(/^[A-Z0-9]{2,7}$/, {
    message: "Identifier must be 2–7 characters (A–Z, 0–9)",
  }),
});

export type teamsSchemaData = z.infer<typeof teamSchema>;
