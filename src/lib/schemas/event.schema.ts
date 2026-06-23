import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title is required"),

  description: z.string().min(10, "Description is too short"),

  category: z.string().min(1, "Select a category"),

  venue: z.string().min(2, "Venue is required"),

  eventDate: z.string().min(1, "Event date is required"),

  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1"),

  coverImage: z.string().url("Please upload an image"),
});

export type CreateEventInput = z.infer<
  typeof createEventSchema
>;