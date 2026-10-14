const { z } = require("zod");

const createLeadSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(120, "Name cannot exceed 120 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .max(254, "Email cannot exceed 254 characters"),
  projectSubject: z
    .string({ required_error: "Project subject is required" })
    .trim()
    .min(1, "Project subject cannot be empty")
    .max(180, "Project subject cannot exceed 180 characters"),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters"),
});

const updateLeadStatusSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "closed"], {
    errorMap: () => ({
      message: "Status must be one of: new, contacted, qualified, closed",
    }),
  }),
});

module.exports = {
  createLeadSchema,
  updateLeadStatusSchema,
};
