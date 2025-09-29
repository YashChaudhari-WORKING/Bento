import { z } from "zod";

export const teamSchema = z.object({
  teamName: z.string().trim().min(1, "Name must be at least 2 characters long"),
  teamSlug: z.string().regex(/^[A-Z][A-Z0-9]{6}$/, {
    message: "Identifier must be at least 1 character long",
  }),
});

export type teamsSchemaData = z.infer<typeof teamSchema>;
