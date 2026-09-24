import { z } from 'zod';

export const createGigSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  category: z
    .string()
    .min(2, 'Please select a valid category'),
  description: z
    .string()
    .min(15, 'Description must be at least 15 characters to explain your service')
    .max(2000, 'Description cannot exceed 2000 characters'),
  rate: z
    .number()
    .positive('Rate must be greater than zero'),
  availability: z.boolean().default(true),
  creatorId: z.string().optional(),
  creatorName: z.string().optional(),
});

export const createBookingSchema = z
  .object({
    gigId: z.string().min(1, 'Gig ID is required'),
    clientName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name cannot exceed 80 characters'),
    clientEmail: z
      .string()
      .email('Please enter a valid email address')
      .optional()
      .or(z.literal('')),
    projectDescription: z
      .string()
      .min(10, 'Project description must be at least 10 characters')
      .max(1500, 'Project description cannot exceed 1500 characters'),
    requestedDate: z.string().optional(),
    targetCompletionDate: z.string().optional(),
  })
  .refine(
    (data) => {
      const d = data.requestedDate || data.targetCompletionDate;
      return Boolean(d && !isNaN(Date.parse(d)));
    },
    { message: 'Please enter a valid target delivery date', path: ['requestedDate'] }
  );

export const declineBookingSchema = z.object({
  reason: z.string().max(300, 'Reason cannot exceed 300 characters').optional(),
});
