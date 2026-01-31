import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1).max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const expenseSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  date: z.string().min(1),
  note: z.string().optional(),
  mood: z.string().nullable().optional(),
})

export const savingsGoalSchema = z.object({
  item: z.string().min(1),
  targetAmount: z.number().positive(),
  savedAmount: z.number().min(0).optional(),
})

export const subscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  frequency: z.enum(['monthly', 'yearly']).default('monthly'),
  nextDue: z.string().min(1),
})

export const budgetSchema = z.object({
  monthly: z.number().min(0).optional(),
  streakDays: z.number().min(0).optional(),
})

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  monthlyIncome: z.number().min(0).nullable().optional(),
  darkMode: z.boolean().optional(),
  guiltFreeMode: z.boolean().optional(),
})

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() })
    }
    req.valid = result.data
    next()
  }
}
