const { z } = require("zod");

const projectSchema = z.object({
  title: z.string(),
  desc: z.string().optional(),
  links: z.string().optional(),
});

const userSchema = z.object({
  name: z.string(),
  email: z.string(),
  education: z.string().optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(projectSchema).optional(),
  work: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]).default("user"),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  education: z.string().optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(projectSchema).optional(),
  work: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
});

module.exports = { userSchema, userUpdateSchema };
