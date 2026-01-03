import { z } from "zod";

export const personalInfoSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    jobTitle: z.string().optional(),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    photoUrl: z.string().optional(),
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    website: z.string().url("Invalid Website URL").optional().or(z.literal("")),
    github: z.string().url("Invalid GitHub URL").optional().or(z.literal(""))
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
